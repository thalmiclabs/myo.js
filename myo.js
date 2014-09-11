
(function(){

	var lastOrientation;

	var makeHistory = function(count, obj){
		var result =[];
		for(var i=0; i<count; i++){ result.push(obj)}
		return result;
	}


	abs = Math.abs;
	sign = function(x) {
	    return typeof x === 'number' ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN : NaN;
	}

	var up_peak, down_peak;

	var t = 0, v= 0;

	var countdown = 0;

	var peakListener = 0;


	var lastPeak;
	var peak;
	peaks=[];

	peaks2 = _.times(200, function(){ return 0});

	var axis = 'x';
	var isPeak = function(){
		var temp = Myo.history.gyroscope;
		var n= Myo.history.gyroscope.length - 2;
		return (abs(temp[n-1][axis]) < abs(temp[n][axis]) && abs(temp[n][axis]) > abs(temp[n+1][axis]))
	}


	peakA=undefined;
	peakB=undefined;



	var populate = function(val){
		var peakVal = abs(val);
		var peakSign = sign(val);

		if(peakVal > 20) {
			peaks2.push(val)
		}else{
			peaks2.push(0);
		}

		if(!peakA){
			peakA = {
				val : peakVal,
				sign : peakSign,
				ts : _.now()
			}
		}else if(!peakB){
			//replace peakA
			if(peakSign == peakA.sign && peakVal > peakA.val){
				peakA = {
					val : peakVal,
					sign : peakSign,
					ts : _.now()
				}
			}else if(peakSign != peakA.sign && (peakVal + peakA.val) > 50){
				peakB = {
					val : peakVal,
					sign : peakSign,
					ts : _.now()
				}
			}
		}

	}

	var detectPeaks = function(){

		var temp = Myo.history.gyroscope;
		var n= Myo.history.gyroscope.length - 2;


		peaks2 = peaks2.slice(1);

		if(countdown > _.now() ){
			peaks2.push(0);
			return;
		}




		if(isPeak()){
			populate(temp[n][axis]);
		}else{
			peaks2.push(0);
		}


		if(peaks.length === 3){

			var delta1 = peaks[0].val + peaks[1].val;
			var delta2 = peaks[1].val + peaks[2].val;

			if(delta1 > delta2 && delta1 > 50){
				console.log(delta1, peaks[0].sign);
				peaks = [];
				countdown = _.now() + 200;
			}else{
				peaks = peaks.slice(1);
			}

		}else if(peaks.length == 2){
			var delta1 = peaks[0].val + peaks[1].val;
			if(peaks[1].ts + 300 < _.now()){
				//console.log(delta1, peaks[0].sign);
				peaks = [];
				countdown = _.now() + 200;
			}

		}else if(peaks.length == 1){
			if(peaks[0].ts + 300 < _.now()){
				peaks = [];
			}
		}


/*
		//detect peak
		if(isPeak()){
			var peakVal = abs(temp[n][axis]);
			var peakSign = sign(temp[n][axis]);


			if(lastPeak && (lastPeak.ts + 200 < _.now())){
				console.log('clearing last peak');
				//lastPeak = undefined;
			}

			if(!lastPeak || (lastPeak.sign == peakSign && peakVal > lastPeak.val)){
				lastPeak = {
					val : abs(peakVal),
					sign : peakSign,
					ts : _.now()
				}
			}else if(lastPeak.sign != peakSign){
				makePair(peakVal, peakSign);
				lastPeak = {
					val : abs(peakVal),
					sign : peakSign,
					ts : _.now()
				}
			}

			//if not the same sign, make a peak pair


		}
*/

/*
		//Check for peak pairs hurr
		if(peak){

			if(peak.ts + 100 < _.now()){
				console.log(peak);
				peak = undefined;
				lastPeak = undefined;
				countdown = _.now() + 200;
			}


		}
*/




		$('#peak').html(JSON.stringify(peaks, null, '\t'));
		$('#lastpeak').html(JSON.stringify([peakA, peakB], null, '\t'));

	}

	var makePair = function(peakVal, peakSign){
		if(lastPeak.val + peakVal < 50) return;

		var delta = lastPeak.val + peakVal;

		if(!peak || delta > peak.delta){
			peak = {
					delta : lastPeak.val + peakVal,
					direction : lastPeak.sign == 1 ? 'up' : 'down',
					ts : _.now()
				}
		}

	}










	Myo = {
		options : {
			api_version : 1,
			socket_url : "ws://127.0.0.1:7204/myo/",
			unlock_timeout : 2000,
			history_size : 200
		},
		offset : {
			x : 0,
			y : 0,
			z : 0,
			w : 0
		},
		history : {
			poses : [],
			gyroscope : [],
			accelerometer : [],
			orientation : []
		},



		_events : [],
		trigger : function(eventName, args){
			this._events.map(function(event){
				if(event.name == eventName || eventName == '*') event.fn(args);
			});
			return this;
		},
		on : function(name, fn){
			var id = new Date().getTime() + "" + this._events.length
			this._events.push({
				id : id,
				name : name,
				fn : fn
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





		start : function(){
			var self = this;

			//setup history array
		//	emptyHistoryArray = Array.apply(null, new Array(this.options.history_size)).map(Number.prototype.valueOf,0);
			this.clearHistory();

			if (!("WebSocket" in window)){
				this.trigger('error', 'Sockets not supported');
				return;
			}
			this.data = {};
			this.socket = new WebSocket(this.options.socket_url + this.options.api_version);
			this.socket.onopen = function() {
				self.trigger('socket_connect');
			};
			this.socket.onerror = function(err) {
				self.trigger('error', err)
			};
			this.socket.onmessage = this.handleMessage.bind(this);
			return this;
		},
		stop : function(){
			this.socket.close();
			return this;
		},

		zeroOrientation : function(){
			this.offset = lastOrientation;
			return this;
		},

		clearHistory : function(){
			this.history = {
				pose : [],
				orientation : makeHistory(this.options.history_size,{x:0,y:0,z:0,w:0}),
				accelerometer : makeHistory(this.options.history_size,{x:0,y:0,z:0}),
				gyroscope : makeHistory(this.options.history_size,{x:0,y:0,z:0})
			};
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

		handleMessage : function(msg){
			var data = JSON.parse(msg.data)[1];

			if(data.type == 'pose'){

				//handle unknown
				var poseName = gestureNames[data.pose];
				this.data.pose = poseName;
				this.trigger('pose', poseName);
				this.trigger(poseName);

			}else if(data.type =='orientation'){

				lastOrientation = data.orientation;


				this.data.orientation = {
					x : data.orientation.x - this.offset.x,
					y : data.orientation.y - this.offset.y,
					z : data.orientation.z - this.offset.z,
					w : data.orientation.w - this.offset.w
				};
				this.data.accelerometer = {
					x : data.accelerometer[0],
					y : data.accelerometer[1],
					z : data.accelerometer[2]
				};
				this.data.gyroscope = {
					x : data.gyroscope[0],
					y : data.gyroscope[1],
					z : data.gyroscope[2]
				};

				this.history.orientation.push(this.data.orientation);
				this.history.orientation = this.history.orientation.slice(1);


				this.history.accelerometer.push(this.data.accelerometer);
				this.history.accelerometer = this.history.accelerometer.slice(1);

				this.history.gyroscope.push(this.data.gyroscope);
				this.history.gyroscope = this.history.gyroscope.slice(1);

				detectPeaks();




				this.trigger('orientation', this.data.orientation);
				this.trigger('accelerometer', this.data.accelerometer);
				this.trigger('gyroscope', this.data.gyroscope);

			}else{
				console.log(data);
				this.trigger(data.type, data)
			}
			this.trigger('heartbeat', data);
		},
	};





})();


var gestureNames = {
	'rest' : 'rest',
	'fingers_spread' : 'spread',
	'wave_in' : 'wave_in',
	"wave_out" : 'wave_out',
	'fist' : 'fist',
	'thumb_to_pinky' : 'unlock',
	'unknown' : 'myo_removed'
};



