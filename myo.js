(function(){

	/**
	 * Utils
	 */
	var extend = function(){
		var result = {};
		for(var i in arguments){
			var obj = arguments[i];
			for(var propName in obj){
				if(obj.hasOwnProperty(propName)){ result[propName] = obj[propName]; }
			}
		}
		return result;
	};



	/*
	var emitPose = function(poseName){

	}

	var handleWave = function(poseName, edge){
		if(poseName == 'wave_in'){
			var pose = ((Myo.arm == 'right') ? 'wave_left' : 'wave_right');
			Myo.trigger(pose, edge);
			Myo.trigger('pose', pose, edge);
		}else if(poseName == 'wave_out'){
			var pose = ((Myo.arm == 'right') ? 'wave_right' : 'wave_left')
			Myo.trigger(pose, edge);
			Myo.trigger('pose', pose, edge);
		}
	}
	*/

	var eventTable = {
		'pose' : function(myo, data){
			if(myo.lastPose != 'rest' && data.pose == 'rest'){
				myo.trigger(myo.lastPose, false);
				myo.trigger('pose', myo.lastPose, false);
			}
			myo.trigger(data.pose, true);
			myo.trigger('pose', data.pose, true);
			myo.lastPose = data.pose;
		},
		'rssi' : function(myo, data){
			myo.trigger('bluetooth_strength', data.rssi);
		},
		'orientation' : function(myo, data){
			var imu_data = {
				orientation : {
					x : data.orientation.x - myo.orientationOffset.x,
					y : data.orientation.y - myo.orientationOffset.y,
					z : data.orientation.z - myo.orientationOffset.z,
					w : data.orientation.w - myo.orientationOffset.w
				},
				accelerometer : {
					x : data.accelerometer[0],
					y : data.accelerometer[1],
					z : data.accelerometer[2]
				},
				gyroscope : {
					x : data.gyroscope[0],
					y : data.gyroscope[1],
					z : data.gyroscope[2]
				}
			}
			if(!myo.lastIMU) myo.lastIMU = imu_data;
			myo.trigger('orientation',   imu_data.orientation);
			myo.trigger('accelerometer', imu_data.accelerometer);
			myo.trigger('gyroscope',     imu_data.gyroscope);
			myo.trigger('imu',           imu_data);
			myo.lastIMU = imu_data;
		},
		'arm_recognized' : function(myo, data){
			myo.arm = data.arm;
			myo.direction = data.x_direction;
			myo.trigger(data.type);
		},
		'arm_lost' : function(myo, data){
			myo.arm = undefined;
			myo.direction = undefined;
			myo.trigger(data.type);
		},
		'connected' : function(myo, data){
			myo.connect_version = data.version.join('.');
			myo.isConnected = true;
			myo.trigger(data.type)
		},
		'disconnected' : function(myo, data){
			myo.isConnected = false;
			myo.trigger(data.type);
		}
	};



	var handleMessage = function(msg){
		var data = JSON.parse(msg.data)[1];
		if(myos[data.myo] && eventTable[data.type]){
			eventTable[data.type](myos[data.myo], data);
		}
	};


	var myos = [];

	Myo = {
		options : {
			api_version           : 1,
			socket_url            : "ws://127.0.0.1:7204/myo/",
			correct_myo_direction : true
		},


		/**
		 * Myo Stats
		 */
		isLocked : false,
		isConnected : false,
		orientationOffset : {x : 0,y : 0,z : 0,w : 0},
		lastIMU : undefined,
		socket : undefined,
		arm : undefined,
		direction : undefined,





		/**
		 * Myo Constructor
		 * @param  {number} id
		 * @param  {object} options
		 * @return {myo}
		 */
		create : function(id, options){
			if(!id) id = 0;
			if(typeof id === "object") options = id;
			options = options || {};

			var newMyo = Object.create(Myo);
			newMyo.options = extend(Myo.options, options);
			newMyo._events = Myo._events.slice(0);
			newMyo.id = id;
			myos[id] = newMyo;
			return newMyo;
		},




		/**
		 * Event functions
		 */
		_events : [],
		trigger : function(eventName){
			var thisMyo = this;
			var args = Array.prototype.slice.apply(arguments).slice(1);
			this._events.map(function(event){
				if(event.name == eventName || eventName == '*') event.fn.apply(thisMyo, args);
			});
			return this;
		},
		on : function(name, fn){
			var id = new Date().getTime() + "" + this._events.length;
			this._events.push({
				id   : id,
				name : name,
				fn   : fn
			});
			return id;
		},
		off : function(name){
			this._events = this._events.reduce(function(result, event){
				if(event.name !== name && event.id !== id) result.push(event);
				return result;
			}, []);
			return this;
		},




		timer : function(status, timeout, fn){
			if(status){
				this.timeout = setTimeout(fn.bind(this), timeout);
			}else{
				clearTimeout(this.timeout)
			}
		},
		lock : function(){
			if(this.isLocked) return true;
			this.isLocked = true;
			this.trigger('lock');
			return this;
		},
		unlock : function(timeout){
			var self = this;
			clearTimeout(lockTimeout);
			if(timeout){
				lockTimeout = setTimeout(function(){
					self.lock();
				}, timeout);
			}
			if(!this.isLocked) return this;
			this.isLocked = false;
			this.trigger('unlock');
			return this;
		},
		zeroOrientation : function(){
			this.orientationOffset = this.lastIMU.orientation;
			this.trigger('zero_orientation');
			return this;
		},

		vibrate : function(intensity){
			intensity = intensity || 'medium';
			this.socket.send(JSON.stringify(['command',{
				"command": "vibrate",
				"myo": this.id,
				"type": intensity
			}]));

			return this;
		},

		requestBluetooth : function(){
			this.socket.send(JSON.stringify(['command',{
				"command": "request_rssi",
				"myo": this.id
			}]));
			return this;
		},
	};


	/**
	 * Sets up the web socket
	 * Ran on library load
	 */
	var startSocket = function(){
		if (!("WebSocket" in window)){
			console.error('Myo.js : Sockets not supported :(');
		}
		if(!Myo.socket){
			Myo.socket = new WebSocket(Myo.options.socket_url + Myo.options.api_version);
		}
		Myo.socket.onerror = function(err) {
			self.trigger('error', err)
		};
		Myo.socket.onmessage = handleMessage;
	}();


})();




