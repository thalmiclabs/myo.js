
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



}());