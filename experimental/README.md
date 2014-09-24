# Myo.js Experimental

The `myo.experimental.js` is a collection of experimental ideas to be used the [myo.js](https://github.com/stolksdorf/myo.js) library. Just include it after your include the core Myo.js file.


### Arm Is Busy

This feature exposes the ability to detect if the arm is busy. It uses an exponential moving average of the sum of the deltas of the gyro data. Whenever that average goes above a certain threshold, we consider the arm is busy doing something; like the user is talking with their hands, drinking coffee, etc
.

You can control how sensitive this is by modifying the `myo.options.armbusy_threshold`. Events `arm_busy` and `arm_rest` will be triggered whenever the arm becomes busy or not. The current state of the arm is stored at `myo.armIsBusy` as a boolean. You can also access the arm busy data at `myo.armBusyData`.

	myMyo.on('fist', function(edge){
		if(!edge || myMyo.armIsBusy || myMyo.isLocked) return;
		console.log('Stable fist');
	});



### Double Tap

This adds a new event called `double_tap` which is emitted when the user quickly taps their Myo twice. We use peaks within the overall deltas of the IMU. You can change the sensitivy of the taps using `myo.options.doubleTap.threshold`. The taps have to be done within 80ms to 300ms, which you can configure using `myo.options.doubleTap.time`. Double tap uses the `myo.armIsBusy` boolean to greatly reduce the number of false positives.

Double Tap is useful for locking or locking the Myo, or providing very contextual controls, such as a communicator tap in a video game.

	//Double tap to lock and unlock!
	myMyo.on('double_tap', function(){
		if(myMyo.isLocked){
			myMyo.unlock();
		}else{
			myMyo.unlock();
		}
	});


### Relative Direction Waves

Using the orientation data with the `wave_in` and `wave_out` poses, we can create four new poses of `wave_right`, `wave_left`, `wave_down` and `wave_up`. This feature requires the user to be orientated properly and often, and orientation drift can greatly reduce the accuracy of these poses.



### Positional Data

Here we try and figure out where the user's Myo is pointing and how much their arm is rotated. A new event of `position` will fired fired whenever new IMU data comes in.

	myMyo.on('position', function(x, y, theta){
		Character.move(x,y);
	});



### Nudges (Not implemented)

Nudges are identified by peaks in accelermoter data. They are emitted in 6 directions; `nudge_up`, `nudge_down`, `nudge_left`, `nudge_right`, `nudge_clockwise`, `nudge_counterclockwise`. The intensity of the nudge is passed along with the event.
