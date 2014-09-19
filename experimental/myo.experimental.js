
(function(){


	/**
	 * Busy Arm Detection
	 */
	Myo.options.armbusy_threshold = Myo.options.armbusy_threshold || 80;
	Myo.armBusyData = 0;
	var ema_alpha = 0.1;
	Myo.on('gyroscope', function(gyro){
		var ema = Myo.armBusyData + ema_alpha * (Math.abs(gyro.x) + Math.abs(gyro.y) + Math.abs(gyro.z) - Myo.armBusyData);
		var busy = ema > Myo.options.armbusy_threshold;
		if(busy !== Myo.armIsBusy){
			Myo.trigger(busy ? 'arm_busy' : 'arm_rest');
		}
		Myo.armIsBusy = busy;
		Myo.armBusyData = ema;
	});



	//Wave up and Wave down



	//Nudge

	//Dynamic Gestures


	/**
	 * Double Tap
	 */
	Myo.options.doubleTap = Myo.options.doubleTap || {};
	Myo.options.doubleTap.time = Myo.options.doubleTap.time || [100, 300];
	Myo.options.doubleTap.threshold = Myo.options.doubleTap.threshold || 0.9;
	var last_y = 0;
	var last_z = 0;
	var last_tap;
	Myo.on('accelerometer', function(data){
		var y = Math.abs(data.y)
		var z = Math.abs(data.z)
		var delta = Math.abs(last_y - y) + Math.abs(last_z - z)
		last_y = y;
		last_z = z;

		if(delta > Myo.options.doubleTap.threshold){
			if(last_tap){
				var diff = _.now() - last_tap;
				if(diff > Myo.options.doubleTap.time[0] && diff < Myo.options.doubleTap.time[1] && !Myo.armIsBusy){
					Myo.trigger('double_tap');
				}
			}
			last_tap = _.now();
		}
	});



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

	/**
	 * GetRoll()
	 */
	Myo.getRoll = function(){



	};

	/**
	 * getPan()
	 */
	Myo.mouse = [0,0];
	Myo.on('imu', function(data){
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



}());