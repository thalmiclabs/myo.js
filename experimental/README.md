# Myo.js Experimental

The `myo.experimental.js` is a collection of experimental ideas to be used the [myo.js](https://github.com/stolksdorf/myo.js) library. Just include it after your include the core Myo.js file.


### Arm Is Busy

This feature exposes the ability to detect if the arm is busy. It uses an exponential moving average of the sum of the deltas of the gyro data. Whenever that average goes above a certain threshold, we consider the arm is busy doing something; like the user is talking with their hands, drinking coffee, etc.

Events `arm_busy` and `arm_rest` will be triggered whenever the arm becomes busy or not. The current state of the arm is stored at `Myo.armIsBusy` as a boolean. You can also access the arm busy data at `Myo.armBusyData`.


### Double Tap

This adds a new event called `double_tap` which is emitted when the user quickly taps their Myo twice. The code uses peaks within the overall deltas of the IMU. You can change the sensitivy of the taps using `Myo.options.doubleTap_threshold`. The taps have to be done within 100ms to 300ms, which you can configure using `Myo.options.doubleTap_time`. Double tap uses the `Myo.armIsBusy` boolean to greatly reduce the number of false positives.

Double Tap is useful for locking or locking the Myo, or providing very contextual controls, such as a communicator tap in a video game.


### Wave Up/Wave Down

Using the orientation data with the `wave_in` and `wave_out` gestures, we can create two new gestures of `wave_down` and `wave_up`. This feature requires the user to be orientated properly and often, and orientation drift can greatly reduce the accuracy of these gestures.

### Nudges

Nudges are identified by peaks in accelermoter data. They are emitted in 6 directions; `nudge_up`, `nudge_down`, `nudge_left`, `nudge_right`, `nudge_clockwise`, `nudge_counterclockwise`. The intensity of the nudge is passed along with the event.


### Dynamic Gestures


### Pose Flicker