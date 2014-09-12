
(function(){


	//Busy Arm
	Myo.options.armbusy_threshold = Myo.options.armbusy_threshold || 80;
	Myo.options.armbusy_length =  Myo.options.armbusy_length || 30;


	var old = 0;

	var armBusyArray = _.times(Myo.options.armbusy_length, function(){return 0});
	Myo.on('gyroscope', function(gyro){
		armBusyArray = armBusyArray.slice(1);
		armBusyArray.push(Math.abs(gyro.x) + Math.abs(gyro.y) + Math.abs(gyro.z));

		var movingAverage = _.reduce(armBusyArray, function(r, v){

			//if(v > r) return v;
			//return r;
			return r + v;
		}, 0)/Myo.options.armbusy_length;





		var val = Math.abs(gyro.x) + Math.abs(gyro.y) + Math.abs(gyro.z);


		var newVal = old + 0.1 * (val - old);

		Myo.ema = newVal;

		old = newVal;


		Myo.armIsBusy = newVal > Myo.options.armbusy_threshold;



		//Remove
		Myo.ma = movingAverage;
	});



	//Double Tap

	Myo.options.doubleTap_minTime = Myo.options.doubleTap_minTime || 100;
	Myo.options.doubleTap_maxTime = Myo.options.doubleTap_maxTime || 300;
	Myo.options.doubleTap_threshold = Myo.options.doubleTap_threshold || 0.9;


	var last_y = 0;
	var last_z = 0;
	var last_tap;
	Myo.on('accelerometer', function(data){
		var y = Math.abs(data.y)
		var z = Math.abs(data.z)
		var delta = Math.abs(last_y - y) + Math.abs(last_z - z)
		last_y = y;
		last_z = z;

		if(delta > Myo.options.doubleTap_threshold){
			if(last_tap){
				var diff = _.now() - last_tap;
				if(diff > Myo.options.doubleTap_minTime && diff < Myo.options.doubleTap_maxTime && !Myo.armIsBusy){
					Myo.trigger('double_tap');
				}
			}
			last_tap = _.now();
		}
	});



}());