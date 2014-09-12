(function(){

	var eventTable = {
		'rest'           : 'rest',
		'fingers_spread' : 'spread',
		'wave_in'        : 'wave_in',
		"wave_out"       : 'wave_out',
		'fist'           : 'fist',
		'thumb_to_pinky' : 'thumb_to_pinky',
		'unknown'        : 'myo_removed'
	};


	var lockTimeout;


	var handleMessage = function(msg){
		var data = JSON.parse(msg.data)[1];

		if(data.type == 'pose'){
			var poseName = eventTable[data.pose];

			if(lastPose != 'rest' && poseName == 'rest'){
				this.trigger(lastPose, false);
				this.trigger('pose', lastPose, false);
			}
			lastPose = poseName;
			this.trigger(poseName, true);
			this.trigger('pose', poseName, true);
		}else if(data.type =='orientation'){
			lastOrientation = data.orientation;

			var imu_data = {
				orientation : {
					x : data.orientation.x - this.offset.x,
					y : data.orientation.y - this.offset.y,
					z : data.orientation.z - this.offset.z,
					w : data.orientation.w - this.offset.w
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

			this.trigger('orientation', imu_data.orientation);
			this.trigger('accelerometer', imu_data.accelerometer);
			this.trigger('gyroscope', imu_data.gyroscope);
			this.trigger('imu', imu_data);


		}else if(data.type =='arm_recognized'){
			this.arm = data.arm;
			this.x_direction = data.x_direction;
			this.trigger('ready');
		}else if(data.type =='rssi'){
			this.trigger('bluetooth_strength', data.rssi);
		}else{
			console.log(data.type, data);
			this.trigger(data.type, data)
		}
	};


	var events = [];
	var lastPose;




	Myo = {
		isLocked : false,
		options : {
			api_version    : 1,
			socket_url     : "ws://127.0.0.1:7204/myo/",
			correct_myo_direction : true
		},
		offset : {
			x : 0,
			y : 0,
			z : 0,
			w : 0
		},




		//_events : [],
		trigger : function(eventName){
			var args = Array.prototype.slice.apply(arguments).slice(1);
			events.map(function(event){
				if(event.name == eventName || eventName == '*') event.fn.apply(Myo, args);
			});
			return this;
		},
		on : function(name, fn){
			var id = new Date().getTime() + "" + events.length;
			events.push({
				id   : id,
				name : name,
				fn   : fn
			});
			return id;
		},
		off : function(name){
			events = events.reduce(function(result, event){
				if(event.name !== name && event.id !== id) result.push(event);
				return result;
			}, []);
			return this;
		},





		start : function(){
			var self = this;
			if (!("WebSocket" in window)){
				this.trigger('error', 'Sockets not supported');
				return;
			}
			this.socket = new WebSocket(this.options.socket_url + this.options.api_version);
			this.socket.onopen = function() {
				self.trigger('socket_connect');
			};
			this.socket.onerror = function(err) {
				self.trigger('error', err)
			};
			this.socket.onmessage = handleMessage.bind(this);
			return this;
		},
		stop : function(){
			this.socket.close();
			return this;
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
			this.offset = lastOrientation;
			return this;
		},

		vibrate : function(intensity){
			intensity = intensity || 'medium';
			this.socket.send(JSON.stringify(['command',{
				"command": "vibrate",
				"myo": 0,
				"type": intensity
			}]));
			return this;
		},

		requestBluetooth : function(){
			this.socket.send(JSON.stringify(['command',{
				"command": "request_rssi",
				"myo": 0
			}]));
			return this;
		},
	};


})();




