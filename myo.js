(function(){


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




	var emitPose = function(poseName){
		if(this.lastPose != 'rest' && poseName == 'rest'){
			this.trigger(this.lastPose, false);
			this.trigger('pose', this.lastPose, false);
			//handleWave(this.lastPose, false);
		}
		this.trigger(poseName, true);
		this.trigger('pose', poseName, true);
		//handleWave(poseName, true);
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



	var handleMessage = function(msg){
		var data = JSON.parse(msg.data)[1];

		if(myos[data.myo]){
			var myo = myos[data.myo].trigger(data.type, data)


			if(data.type == 'pose'){
				emitPose.call(myo, data.pose);
				myo.lastPose = data.pose;
			}else if(data.type =='orientation'){
				myo.lastOrientation = data.orientation;
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

				myo.trigger('orientation', imu_data.orientation);
				myo.trigger('accelerometer', imu_data.accelerometer);
				myo.trigger('gyroscope', imu_data.gyroscope);
				myo.trigger('imu', imu_data);

			//Lifecycle events
			}else if(data.type =='arm_recognized'){
				myo.arm = data.arm;
				myo.x_direction = data.x_direction;
				myo.trigger('arm_recognized');
			}else if(data.type =='arm_recognized'){
				myo.arm = data.arm;
				myo.x_direction = data.x_direction;
				myo.trigger('arm_recognized');
			}else if(data.type =='rssi'){
				myo.trigger('bluetooth_strength', data.rssi);
			}else if(data.type =='paired'){
				myo.connect_version = data.version.join('.');
			}else{
				console.log(data.type, data);
				myo.trigger(data.type, data)
			}

		}
	}


	var myos = [];

	var socket;

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
		orientationOffset : {
			x : 0,
			y : 0,
			z : 0,
			w : 0
		},
		lastOrientation : {
			x : 0,
			y : 0,
			z : 0,
			w : 0
		},
		socket : undefined,





		/**
		 * Myo Contrsuctor
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
			this.orientationOffset = lastOrientation;
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




