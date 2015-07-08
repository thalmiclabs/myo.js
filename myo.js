(function(){

	var Socket;
	if(typeof window === 'undefined'){
		Socket = require('ws');
	}else {
		if(!("WebSocket" in window)) console.error('Myo.js : Sockets not supported :(');
		Socket = WebSocket;
	}


	/**
		Myo Root Object
	**/
	var myoList = {};
	Myo = {
		defaults : {
			api_version : 3,
			socket_url  : "ws://127.0.0.1:10138/myo/",
		},
		lockingPolicy : 'standard',

		events : [],
		myos : [],


		onError : function(){
			throw 'Myo.js had an error with the socket. Myo Connect might not be running. If it is, double check the API version.';
		},


		setLockingPolicy: function(policy) {
			Myo.socket.send(JSON.stringify(['command',{
				"command": "set_locking_policy",
				"type": policy
			}]));
			Myo.lockingPolicy = policy;
			return Myo;
		},

		/**
		 * Event functions
		 */
		trigger : function(eventName){
			var args = Array.prototype.slice.apply(arguments).slice(1);
			emitter.trigger.call(Myo, Myo.events, eventName, args);
			return Myo;
		},
		on : function(eventName, fn){
			return emitter.on(Myo.events, eventName, fn);
		},
		off : function(){
			//TODO
		},

		/*
		initSocket : function(){
			Myo.socket = new Socket(Myo.defaults.socket_url + Myo.defaults.api_version);
			Myo.socket.onmessage = handleMessage;
			Myo.socket.onerror = Myo.onError;
		},
		*/

		connect : function(){
			Myo.socket = new Socket(Myo.defaults.socket_url + Myo.defaults.api_version);
			Myo.socket.onmessage = handleMessage;
			Myo.socket.onopen = Myo.trigger.bind(Myo, 'ready');
			Myo.socket.onclose = Myo.trigger.bind(Myo, 'socket_closed');
			Myo.socket.onerror = Myo.onError;
		},
		disconnect : function(){
			Myo.socket.close();
		},
	};
	var handleMessage = function(msg){
		var data = JSON.parse(msg.data)[1];
		if(!data.type || !data.myo) return;
		if(data.type == 'paired' && !Myo.myos[data.myo]) myoInstance.create(data);
		var myo = myoList[data.myo];
		var isStatusEvent = true;
		if(eventTable[data.type]){
			isStatusEvent = eventTable[data.type](myo, data);
		}
		if(!eventTable[data.type] || isStatusEvent){
			myo.trigger(data.type, data, data.timestamp);
			myo.trigger('status', data, data.timestamp);
		}
	};




	var myoInstance = {
		create : function(pairedDataMsg){
			var newMyo = utils.merge(Object.create(myoInstance), {
				macAddress      : pairedDataMsg.mac_address,
				name            : pairedDataMsg.name,
				myoConnectIndex : pairedDataMsg.myo,
				locked          : true,
				connected       : false,
				batteryLevel    : 0,
				lastIMU         : undefined,
				arm             : undefined,
				direction       : undefined,
				warmupState     : undefined,
				orientationOffset : {x : 0,y : 0,z : 0,w : 1},
				events : [],
			});
			delete newMyo.create;
			Myo.myos.push(newMyo);
			myoList[pairedDataMsg.myo] = newMyo;
		},

		trigger : function(eventName){
			var args = Array.prototype.slice.apply(arguments).slice(1);
			emitter.trigger.call(this, Myo.events, eventName, args);
			emitter.trigger.call(this, this.events, eventName, args);
			return this;
		},
		on : function(eventName, fn){
			return emitter.on(this.events, eventName, fn);
		},
		off : function(eventName){
			this.events = emitter.off(this.events, eventName);
		},
		lock : function(){
			Myo.socket.send(JSON.stringify(["command", {
				"command": "lock",
				"myo": this.myoConnectIndex
			}]));
			return this;
		},
		unlock : function(hold){
			Myo.socket.send(JSON.stringify(["command", {
				"command": "unlock",
				"myo": this.myoConnectIndex,
				"type": (hold ? "hold" : "timed")
			}]));
			return this;
		},
		zeroOrientation : function(){
			this.orientationOffset = utils.quatInverse(this.lastQuant);
			this.trigger('zero_orientation');
			return this;
		},
		vibrate : function(intensity){
			intensity = intensity || 'medium';
			Myo.socket.send(JSON.stringify(['command',{
				"command": "vibrate",
				"myo": this.myoConnectIndex,
				"type": intensity
			}]));
			return this;
		},
		requestBluetoothStrength : function(){
			Myo.socket.send(JSON.stringify(['command',{
				"command": "request_rssi",
				"myo": this.myoConnectIndex
			}]));
			return this;
		},
		streamEMG : function(enabled){
			Myo.socket.send(JSON.stringify(['command',{
				"command": "set_stream_emg",
				"myo": this.myoConnectIndex,
				"type" : (enabled ? 'enabled' : 'disabled')
			}]));
			return this;
		}
	};








	var eventTable = {
		'pose' : function(myo, data){
			if(myo.lastPose){
				myo.trigger(myo.lastPose + '_off');
				myo.trigger('pose_off', myo.lastPose);
			}
			if(data.pose == 'rest'){
				myo.trigger('rest');
				myo.lastPose = null;
				if(Myo.lockingPolicy === 'standard') myo.unlock();
			}else{
				myo.trigger(data.pose);
				myo.trigger('pose', data.pose);
				myo.lastPose = data.pose;
				if(Myo.lockingPolicy === 'standard') myo.unlock(true);
			}
		},
		'orientation' : function(myo, data){
			myo.lastQuant = data.orientation;
			ori = utils.quatRotate(myo.orientationOffset, data.orientation);
			var imu_data = {
				orientation : ori,
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
			};
			if(!myo.lastIMU) myo.lastIMU = imu_data;
			myo.trigger('orientation',   imu_data.orientation, data.timestamp);
			myo.trigger('accelerometer', imu_data.accelerometer, data.timestamp);
			myo.trigger('gyroscope',     imu_data.gyroscope, data.timestamp);
			myo.trigger('imu',           imu_data, data.timestamp);
			myo.lastIMU = imu_data;
		},
		'emg' : function(myo, data){
			myo.trigger(data.type, data.emg, data.timestamp);
		},


		//Status Events

		'arm_synced' : function(myo, data){
			myo.arm = data.arm;
			myo.direction = data.x_direction;
			return true;
		},
		'arm_unsynced' : function(myo, data){
			myo.arm = undefined;
			myo.direction = undefined;
			return true;
		},
		'connected' : function(myo, data){
			myo.connect_version = data.version.join('.');
			myo.connected = true;
			for(var attr in data){
				myo[attr] = data[attr];
			}
			return true;
		},
		'disconnected' : function(myo, data){
			myo.connected = false;
			return true;
		},
		'locked' : function(myo, data){
			myo.locked = true;
			return true;
		},
		'unlocked' : function(myo, data){
			myo.locked = false;
			return true;
		},

		'rssi' : function(myo, data){
			myo.trigger('bluetooth_strength', data.rssi, data.timestamp);
			myo.trigger('status', data, data.timestamp);
		},
		'battery_level' : function(myo, data){
			myo.batteryLevel = data.battery_level;
			myo.trigger('battery_level', data.battery_level, data.timestamp);
			myo.trigger('status', data, data.timestamp);
		},

	};



	/**
	 * Eventy-ness
	 */

	var emitter = {
		eventCounter : 0,
		trigger : function(events, eventName, args){
			var self = this;
			events.map(function(event){
				if(event.name == eventName) event.fn.apply(self, args);
				if(event.name == '*'){
					var args_temp = args.slice(0);
					args_temp.unshift(eventName);
					event.fn.apply(self, args_temp);
				}
			});
			return this;
		},
		on : function(events, name, fn){
			var id = new Date().getTime() + "" + emitter.eventCounter++;
			events.push({
				id   : id,
				name : name,
				fn   : fn
			});
			return id;
		},
		off : function(events, name){
			events = events.reduce(function(result, event){
				if(event.name == name || event.id == name) {
					return result;
				}
				result.push(event);
				return result;
			}, []);
			return events;
		},
	};

	var unique_counter = 0;
	var utils = {
		merge : function(obj1,obj2){
			var obj3 = {};
			for(var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
			for(var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
			return obj3;
		},
		quatInverse : function(q) {
			var len = Math.sqrt(q.x * q.x + q.y * q.y + q.z * q.z + q.w * q.w);
			return {
				w: q.w/len,
				x: -q.x/len,
				y: -q.y/len,
				z: -q.z/len
			};
		},
		quatRotate : function(q, r) {
			return {
				w: q.w * r.w - q.x * r.x - q.y * r.y - q.z * r.z,
				x: q.w * r.x + q.x * r.w + q.y * r.z - q.z * r.y,
				y: q.w * r.y - q.x * r.z + q.y * r.w + q.z * r.x,
				z: q.w * r.z + q.x * r.y - q.y * r.x + q.z * r.w
			};
		}
	};










	if(typeof module !== 'undefined') module.exports = Myo;
})();




