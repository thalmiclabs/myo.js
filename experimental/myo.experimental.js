
(function(){


	/**
	 * Snap Gesture
	 */

	Myo.on('imu', function(data){

		//var  = data.accelerometer



	});

	/**
	 * Relative Direction Waves
	 */
	Myo.options.use_relative_waves = false;
	//TODO: Add wave up and down
	Myo.on('wave_in', function(edge){
		(this.arm == 'left') ?
			this.trigger('wave_right', edge) :
			this.trigger('wave_left', edge);
	});
	Myo.on('wave_out', function(edge){
		(this.arm == 'left') ?
			this.trigger('wave_left', edge) :
			this.trigger('wave_right', edge);
	});


	/**
	 * Busy Arm Detection
	 */
	Myo.options.armbusy_threshold = Myo.options.armbusy_threshold || 80;
	Myo.armBusyData = 0;
	Myo.on('gyroscope', function(gyro){
		this.armBusyData = this.armBusyData || 0;
		var ema_alpha = 0.05;
		var ema = this.armBusyData + ema_alpha * (Math.abs(gyro.x) + Math.abs(gyro.y) + Math.abs(gyro.z) - this.armBusyData);
		var busy = ema > this.options.armbusy_threshold;
		if(busy !== this.armIsBusy){
			this.trigger(busy ? 'arm_busy' : 'arm_rest');
		}
		this.armIsBusy = busy;
		this.armBusyData = ema;
	});


	/**
	 * Double Tap
	 */
	Myo.options.doubleTap = Myo.options.doubleTap || {};
	Myo.options.doubleTap.time = Myo.options.doubleTap.time || [80, 300];
	Myo.options.doubleTap.threshold = Myo.options.doubleTap.threshold || 0.9;
	Myo.on('accelerometer', function(data){
		var last = this.lastIMU.accelerometer
		var y = Math.abs(data.y)
		var z = Math.abs(data.z)
		var delta = Math.abs(Math.abs(last.y) - y) + Math.abs(Math.abs(last.z) - z);

		if(delta > this.options.doubleTap.threshold){
			if(this.last_tap){
				var diff = new Date().getTime() - this.last_tap;
				if(diff > this.options.doubleTap.time[0] && diff < this.options.doubleTap.time[1] && !this.armIsBusy){
					this.trigger('double_tap');
				}
			}
			this.last_tap = new Date().getTime();
		}
	});




	/**
	 * Snap
	 */
	var MAX_DIFF = 2.8;
	var MIN_DIFF = 0.122070312;
	var BLIP_THRESHOLD = -0.061035156 * 1.8;

	var snapHistory = _.times(20, function(){ return {x:0,y:0,z:0}});

	Myo.on('accelerometer', function(data){

		var ssc = {x:0,y:0,z:0};

		var max = _.clone(data);
		var min = _.clone(data);

		// update snapHistory
		snapHistory.push(data);
		snapHistory = snapHistory.slice(1);

		for(var i = 1; i < snapHistory.length -1; i++){
			var prev = snapHistory[i+1];
			var current = snapHistory[i];
			var next = snapHistory[i-1];

			_.each(['x', 'y', 'z'], function(axis){
				if((current[axis] - prev[axis]) * (next[axis] - current[axis]) < BLIP_THRESHOLD){
					ssc[axis]++;
				}
				if(current[axis] > max[axis]) max[axis] = current[axis];
				if(current[axis] < min[axis]) min[axis] = current[axis];
			});
		}

		var hasBlip = (ssc.x > 0 && ssc.y > 2) || (ssc.x+ssc.y+ssc.z > 4);

		//check diff Thresholds
		var peakedThresholds = _.all(['x', 'y', 'z'], function(axis){
			var peakDiff = max[axis] - min[axis];
			return peakDiff >= MIN_DIFF && peakDiff <= MAX_DIFF;
		});

		if(hasBlip && peakedThresholds){
			this.trigger('snap');
			snapHistory = _.times(20, function(){ return {x:0,y:0,z:0}});
		}
	});












	/**
	 * Positional Data
	 */
	Myo.on('orientation', function(data){
		var inverse = (this.direction == 'toward_wrist') ? 1 : -1;
		//TODO : Use the hamilton/quaterion calcs... eventually
		var x    = data.w * inverse;
		var y    = (data.x - data.y/2) * inverse;
		var theta =(data.x * 180) * inverse;

		//theta  = Math.atan2(2*data.y*data.w - 2*data.x*data.z, 1 - 2*data.y*data.y - 2*data.z*data.z);
		//y = Math.atan2(2*data.x*data.w - 2*data.y*data.z, 1 - 2*data.x*data.x - 2*data.z*data.z);
		//x   =  Math.asin(2*data.x*data.y + 2*data.z*data.w);

		//console.log(theta);

		this.trigger('position', x, y, theta);
	});


	/**
	 * Better Positional, WIP
	 *
	 */
	/*
	Myo.mouse = [0,0];
	Myo.on('imu', function(data){

		var deg2rad = function(deg){
			return deg*Math.PI/180;
		}

		var rotate = function(quat, vec3){
			quat.w = quat.w || 0;
			var hp = function(a, b){
				return {
					w : a.w*b.w - a.x*b.x - a.y*b.y - a.z*b.z,
					x : a.w*b.x + a.x*b.w + a.y*b.z - a.z*b.y,
					y : a.w*b.y - a.x*b.z + a.y*b.w + a.z*b.x,
					z : a.w*b.z + a.x*b.y - a.y*b.x + a.z*b.w
				}
			};
			var vec4 = {
				w : 0,
				x : vec3.x,
				y : vec3.y,
				z : vec3.z
			}
			var quat_p = {
				w : quat.w,
				x : -1 * quat.x,
				y : -1 * quat.y,
				z : -1 * quat.z
			};
			var r = hp(hp(quat, vec4), quat_p);
			return {
				w : r.w,
				x : r.x,
				y : r.y,
				z : r.z
			}
		}

		var crossProduct = function(a, b){
			return {
				x : a.y*b.z - a.z*b.y,
				y : a.z*b.x - a.x*b.z,
				z : a.x*b.y - a.y*b.x
			}
		};
		var normalize = function(quat){
			var mag = Math.sqrt(Math.pow(quat.w,2) + Math.pow(quat.x,2) + Math.pow(quat.y,2) + Math.pow(quat.z,2));
			return {
				w : quat.w / mag,
				x : quat.x / mag,
				y : quat.y / mag,
				z : quat.z / mag
			};
		};



		var gyro = data.gyroscope;
		var quat = data.orientation;

		// Accel vector in world space
		var gyroRad = {
			x : deg2rad(gyro.x),
			y : deg2rad(gyro.y),
			z : deg2rad(gyro.z)
		};

		// Gyro vector in world space
		var gyroRadWorld = rotate(quat, gyroRad);

		// Forward vector
		var forwardSource = {x : 1, y : 0, z : 0};
		var forward = rotate(quat, forwardSource);

		// Right vector
		var right = crossProduct(forward, {x:0, y:0, z : -1});

		// Get quat that rotates Myo's right vector
		var up ={x:0, y:1, z : 0};

		var yCompensationQuat = normalize(rotate(right, up))

		// Rotate accel vector through y-compensation quat
		var gyroVectorCompensated = rotate(yCompensationQuat, gyroRadWorld);

		// Get x and y components of accel vector
		var dx = -gyroRadWorld.z;
		var dy = gyroVectorCompensated.y;

		var sensitivity = 0.5;
		var acceleration = 0.3;

		var frameDuration = 1/60;
		var deviceSpeed = Math.sqrt(dx*dx + dy*dy);


		var inflectionVelocity = sensitivity * (Math.PI - 0.174532925) + 0.174532925;

		var CDMax = 4580 / Math.PI / 6.0;
		var CDMin = 6.0 / 0.274532925;
		var CDGain = CDMin + (CDMax - CDMin) / ( 1 + Math.pow(2.7182818, -acceleration * (deviceSpeed - inflectionVelocity)));

		var gain = CDGain * 0.83;

		var _dx = dx * gain * frameDuration;
		var _dy = dy * gain * frameDuration;


		Myo.mouse = [Myo.mouse[0] + _dx, (Myo.mouse[1] || 0) + _dy];
	})
*/

}());