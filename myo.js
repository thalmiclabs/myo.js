(function(){

	var Socket;
	if(typeof window === 'undefined'){
		Socket = require('ws');
	}else {
		if (!("WebSocket" in window)){
			console.error('Myo.js : Sockets not supported :(');
		}
		Socket = WebSocket;
	}
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
	var unique_counter = 0;
	var getUniqueId = function(){
		unique_counter++;
		return new Date().getTime() + "" + unique_counter;
	}


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
			myo._lastQuant = data.orientation;
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
		'arm_synced' : function(myo, data){
			myo.arm = data.arm;
			myo.direction = data.x_direction;
			myo.trigger(data.type, data);
		},
		'arm_unsynced' : function(myo, data){
			myo.arm = undefined;
			myo.direction = undefined;
			myo.trigger(data.type, data);
		},
		'connected' : function(myo, data){
			myo.connect_version = data.version.join('.');
			myo.isConnected = true;
			myo.trigger(data.type, data)
		},
		'disconnected' : function(myo, data){
			myo.isConnected = false;
			myo.trigger(data.type, data);
		},
		'emg' : function(myo, data){
			myo.trigger(data.type, data.emg)
		}
	};

	var handleMessage = function(msg){
		var data = JSON.parse(msg.data)[1];
		if(Myo.myos[data.myo] && eventTable[data.type]){
			eventTable[data.type](Myo.myos[data.myo], data);
		}
	};


	/**
	 * Eventy-ness
	 */
	var trigger = function(events, eventName, args){
		var self = this;
		//
		events.map(function(event){
			if(event.name == eventName) event.fn.apply(self, args);
			if(event.name == '*'){
				args.unshift(eventName)
				event.fn.apply(self, args);
			}
		});
		return this;
	};
	var on = function(events, name, fn){
		var id = getUniqueId()
		events.push({
			id   : id,
			name : name,
			fn   : fn
		});
		return id;
	};
	var off = function(events, name){
		events = events.reduce(function(result, event){
			if(event.name == name || event.id == name) {
				return result;
			}
			result.push(event);
			return result;
		}, []);
		return events;
	};



	var myoInstance = {
		isLocked : false,
		isConnected : false,
		orientationOffset : {x : 0,y : 0,z : 0,w : 0},
		lastIMU : undefined,
		socket : undefined,
		arm : undefined,
		direction : undefined,
		events : [],

		trigger : function(eventName){
			var args = Array.prototype.slice.apply(arguments).slice(1);
			trigger.call(this, Myo.events, eventName, args);
			trigger.call(this, this.events, eventName, args);
			return this;
		},
		on : function(eventName, fn){
			return on(this.events, eventName, fn)
		},
		off : function(eventName){
			this.events = off(this.events, eventName);
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
			clearTimeout(this.lockTimeout);
			if(timeout){
				this.lockTimeout = setTimeout(function(){
					self.lock();
				}, timeout);
			}
			if(!this.isLocked) return this;
			this.isLocked = false;
			this.trigger('unlock');
			return this;
		},
		zeroOrientation : function(){
			this.orientationOffset = this._lastQuant;
			this.trigger('zero_orientation');
			return this;
		},

		vibrate : function(intensity){
			intensity = intensity || 'medium';
			Myo.socket.send(JSON.stringify(['command',{
				"command": "vibrate",
				"myo": this.id,
				"type": intensity
			}]));
			return this;
		},
		requestBluetoothStrength : function(){
			Myo.socket.send(JSON.stringify(['command',{
				"command": "request_rssi",
				"myo": this.id
			}]));
			return this;
		},
		streamEMG : function(enabled){
			var type = 'enabled';
			if(enabled === false) type = 'disabled';
			Myo.socket.send(JSON.stringify(['command',{
				"command": "set_stream_emg",
				"myo": this.id,
				"type" : type
			}]));
			return this;
		},
	}


	Myo = {
		options : {
			api_version : 3,
			socket_url  : "ws://127.0.0.1:10138/myo/"
		},
		events : [],
		myos : [],

		/**
		 * Myo Constructor
		 * @param  {number} id
		 * @param  {object} options
		 * @return {myo}
		 */
		create : function(id, options){
			if(!Myo.socket) Myo.initSocket();

			if(!id) id = 0;
			if(typeof id === "object") options = id;
			options = options || {};

			var newMyo = Object.create(myoInstance);
			newMyo.options = extend(Myo.options, options);
			newMyo.events = [];
			newMyo.id = id;
			Myo.myos[id] = newMyo;
			return newMyo;
		},

		/**
		 * Event functions
		 */
		trigger : function(eventName){
			var args = Array.prototype.slice.apply(arguments).slice(1);
			trigger.call(Myo, Myo.events, eventName, args);
			return Myo;
		},
		on : function(eventName, fn){
			return on(Myo.events, eventName, fn)
		},
		initSocket : function(){
			Myo.socket = new Socket(Myo.options.socket_url + Myo.options.api_version);
			Myo.socket.onmessage = handleMessage;
			Myo.socket.onerror = function(){
				console.error('ERR: Myo.js had an error with the socket. Double check the API version.');
			}
		}
	};
	if(typeof module !== 'undefined') module.exports = Myo;
})();




