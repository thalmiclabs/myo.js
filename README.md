# Myo.js
Myo.js allows you to easily integrate your Myo with javascript.



## Events
You can create listeners to the events by using the `Myo.on()` function. You can even fire your own events using `Myo.trigger()`.

**ready** &nbsp; `Myo.on('ready', function(){ ... })` <br>
Fired after the Myo is connected and paired with your computer, and the arm is recognized.

**imu** &nbsp; `Myo.on('imu', function(data){ ... })` <br>
This event is fired whenever we receive IMU data from the Myo. This data is grouped like this:

	{
		orientation : {
			x : NUM,
			y : NUM,
			z : NUM,
			W : NUM
		},
		gyroscope : {
			x : NUM,
			y : NUM,
			z : NUM
		},
		accelerometer : {
			x : NUM,
			y : NUM,
			z : NUM
		}
	}

**gyroscope** &nbsp; `Myo.on('gyroscope', function(data){ ... })` <br>
This event is fired whenever we receive gyroscopic data from the Myo. This data is grouped as 3d coordinates.

**orientation** &nbsp; `Myo.on('orientation', function(data){ ... })` <br>
This event is fired whenever we receive orientation data from the Myo. This data is grouped as a quanternion.

**accelerometer** &nbsp; `Myo.on('accelerometer', function(data){ ... })` <br>
This event is fired whenever we receive acceleration data from the Myo. This data is grouped as 3d coordinates.

**bluetooth_strength** &nbsp; `Myo.on('bluetooth_strength', function(data){ ... })` <br>
Fired after `Myo.requestBluetoothStrength()` is called. Returns a measure of the bluetooth strength the Myo is connected to.

**pose** &nbsp; `Myo.on('pose', function(pose_name, edge){ ... })` <br>
Whenever the Myo detects a pose change it will fire a `pose` event. The listener will be called with the `pose_name` and the `edge` which will be `true` if it is the start of the pose and `false` if it is the end of the pose. Myo.js will also fire an individual event for each pose with the `edge` as the only parameter for the listener. Here is a list of all the poses : `rest`,`fingers_spread`,`wave_in`,`wave_out`,`fist`,`thumb_to_pinky`.

	Myo.on('pose', function(pose_name, edge){
		if(pose_name != 'rest' && edge){
			console.log('Started ', pose_name);
		}
	});
	Myo.on('wave_in', function(edge){
		if(edge) Menu.left()
	})

**lock** &nbsp; `Myo.on('lock', function(){ ... })` <br>
Fired whenever `Myo.lock()` is called. Useful for firing vibration events, or updating UI when the Myo becomes locked.

**unlock** &nbsp; `Myo.on('unlock', function(){ ... })` <br>
Fired whenever `Myo.unlock()` is called. Useful for firing vibration events, or updating UI when the Myo becomes unlocked.

**error** &nbsp; `Myo.on('error', function(message){ ... })` <br>
If Myo.js ever encounters an error, it'll fire an error event.


## Functions

### Eventy-ness

**on** &nbsp; `Myo.on(eventName, function(arg1, arg2,...))` <br>
On sets up a listener for a specific event name. Whenever that event is triggered, each function added with `on()`, will be called with whatever arguments `trigger()` was called with. Returns a unique event id for this listener.

	Myo.on('fist', function(start){
		if(start)  console.log('fist pose start');
		if(!start) console.log('fist pose end');
	});

**trigger** &nbsp; `Myo.trigger(eventName, [arg1, arg2, ...])` <br>
Trigger activates each listener for a specific event. You can add any additional parameters to be passed to the listener. Myo.js uses this internally to trigger events.

**off** &nbsp; `Myo.off(eventName), Myo.off(eventId)` <br>
Off removes all listeners on an Myo for a given event name or id.


### Myo Specific

**start** &nbsp; `Myo.start()` <br>
Kicks off the library creating and listening to the websocket for data coming in from your Myo.

**stop** &nbsp; `Myo.stop()` <br>
Closes the web socket listening to the Myo.

**zeroOrientation** &nbsp; `Myo.zeroOrientation()` <br>
When called, however the Myo is orientated will now be the origin. This offset value will be stored at `Myo.orientationOffset`.

**lock** &nbsp; `Myo.lock()` <br>
Sets `Myo.isLocked` to true and fires the `lock` event. Myo.js does nothing with `Myo.isLocked`, it's up to the developer to implement locking features. For example:

	Myo.on('fist', function(egde){
		if(Myo.isLocked || !edge) return;
		Enemies.smash();
	});

**unlock** &nbsp; `Myo.unlock(), Myo.unlock(timeout)` <br>
Sets `Myo.isLocked` to false and fires the `unlock` event. If a `timeout` is passed in, it will call `Myo.lock()` after the timeout has passed. Subsequient calls will reset the timeout.

**vibrate** &nbsp; `Myo.vibrate('short' | 'medium' | 'long')` <br>
Makes the Myo vibrate. Defaults to `'medium'`.

**requestBluetoothStrength** &nbsp; `Myo.requestBluetoothStrength()` <br>
Requests the connection strength of the Myo to be sent. Listen to the `'bluetooth_strength'` event for the data.

	Myo.on('bluetooth_strength', function(val){
		console.log('Such strength', val);
	});
	Myo.requestBluetoothStrength();

**timer** &nbsp; `Myo.timer(on_off, duration, callback)` <br>
Timer is useful for when you want a simple timeout for an action, such as holding a gesture for a period of time. `on_off` is a boolean that will create or disable the current timer with a duration of `duration` that will fire the `callback`.

	//Fires a spread_hold event if spread is held for half a second
	Myo.on('spread', function(edge){
		Myo.timer(edge, 500, function(){
			Myo.trigger('spread_hold')
		})
	})




## Options
correct_myo_direction
pose_flicker_timeout
emit_cardinal_waves




## Data
isLocked
isPaired
isConnected
orientationOffset
lastOrientation
connect_verion
myoId
x_direction
arm

