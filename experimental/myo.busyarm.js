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