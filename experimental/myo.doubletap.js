/**
 * Double Tap
 *
 * requires myo.busyarm.js
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