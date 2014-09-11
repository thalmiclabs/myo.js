# Myo.js

Myo.js allows you to easily integrate your myo with javascript.




rest,fingers_spread,wave_in,wave_out,fist,thumb_to_pinky
lock, unlock
wave_right
wave_left


## Events

**trigger** &nbsp; `object.trigger(event, [arg1, arg2, ...])` <br>



imu
gyroscope
orientation
accelerometer
pose (poseName, edge)
[rest,fingers_spread,wave_in,wave_out,fist,thumb_to_pinky]

error


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


**zeroOrientation** &nbsp; `Myo.zeroOrientation()` <br>
When called, however the Myo is orientated will now be the origin for the orientation.

**lock** &nbsp; `Myo.lock()` <br>
Sets `Myo.isLocked` to true and fires the `lock` event.

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




## Options
{
	correct_myo_direction (true)



## Data
isLocked
isPaired
isConnected
offset
lastOrientation

