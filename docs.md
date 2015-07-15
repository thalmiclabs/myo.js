# documentation

## myo core

**myos** &nbsp; `Myo.myos` <br>
An array containing the created Myo instances when a Myo pairs with Myo Connect

**create** &nbsp; `Myo.create(), Myo.create(data)` <br>
Creates and returns a new Myo instance. `data` can be an object which will be merged onto the instance. This command is generally not needed, as Myo.js will create instances for every paired Myo on your computer automatically.

**on** &nbsp; `Myo.on(eventName, callback)` <br>
Creates a global listener for each Myo instance for the given event. The `callback`'s context will be the Myo instance.

	Myo.on('connected', function(){
		console.log('connected!', this.id)
	});

Every event is sent with a timestamp in microseconds. Thus, the full signature of the 'connected' event above, would look like this:

	Myo.on('connected', function(data, timestamp){
		console.log('connected!', this.id)
	});

Of course, declaration of parameters are optional in callbacks.

**off** &nbsp; `Myo.off(eventName)` <br>
Removes a create global listener.

**trigger** &nbsp; `Myo.trigger(eventName)` <br>
Triggers a create global event which all myos within the `Myo.myos` array will respond to.

**setLockingPolicy** &nbsp; `Myo.setLockingPolicy(policyType)` <br>
Sets the locking policy in Myo Connect. Can either be `"standard"` or `"none"`. Standard will automatically lock the Myo after a while, while None will constantly stream events regardless of lock state.

**connect** &nbsp; `Myo.connect()` <br>
Creates web socket and sets up the message listener.

**disconnect** &nbsp; `Myo.disconnect()` <br>
Closes the web socket

**onError** &nbsp; `Myo.onError` <br>
`Myo.onError` is triggered whenever Myo.js can't establish a connection to Myo Connect. This could be that it's not running, or that your API version is out of date. You can override this function with a function of your choice.

	Myo.onError = function(){
		console.log("Woah, couldn't connect to Myo Connect");
	}
	Myo.create();

**methods** &nbsp; `Myo.methods` <br>
`methods` is an object of functions that will be added to each myo instance when it is created. If you are making an add-on you may want to add your own functions to this object.

	Myo.methods.helloWorld = function(){
		console.log('Hello ' + this.name);
	}
	Myo.connect();
	Myo.myos[0].helloWorld();



## myo data
**macAddress** &nbsp; `myo.macAddress` <br>
Stores the macAddress of the Myo.

**name** &nbsp; `myo.name` <br>
Stores the name of the Myo.

**connectIndex** &nbsp; `myo.connectIndex` <br>
This index is used to listen and send specific messages to Myo Connect.

**connectVerion** &nbsp; `myo.connectVerion` <br>
Stores the version of Myo Connect.

**direction** &nbsp; `myo.direction` <br>
Stores the direction that the User is wearing the Myo. Can either be `"toward_elbow"` or `"toward_wrist"`, referencing the Thalmic logo on the device.

**arm** &nbsp; `myo.arm` <br>
Stores which arm the Myo is being worn on. Either `"left"` or `"right"`

**orientationOffset** &nbsp; `myo.orientationOffset` <br>
Stores the offset quaternion used with `myo.zeroOrientation()`.

**lastIMU** &nbsp; `myo.lastIMU` <br>
Stores the last IMU object. Useful when you need to look at changes over time.

**connected** &nbsp; `myo.connected` <br>
Stores a boolean on whether the Myo is currently connected.

**locked** &nbsp; `myo.locked` <br>
Stores a boolean on whether the Myo is currently locked.

**warmupState** &nbsp; `myo.warmupState` <br>
Stores the warmup state of the Myo. Either `"cold"` or `"warm"`

**batteryLevel** &nbsp; `myo.batteryLevel` <br>
Stores the last recorded battery level from the device. Range from 0 to 100.




## myo functions

**on** &nbsp; `myo.on(eventName, function(arg1, arg2,...))` <br>
On sets up a listener for a specific event name. Whenever that event is triggered, each function added with `on()`, will be called with whatever arguments `trigger()` was called with. Returns a unique event id for this listener.

	myMyo.on('fist', function(){
		console.log('fist pose start');
	});
	myMyo.on('fist_off', function(){
		console.log('fist pose end');
	});

**trigger** &nbsp; `myo.trigger(eventName, arg1, arg2, ...)` <br>
Trigger activates each listener for a specific event. You can add any additional parameters to be passed to the listener. Myo.js uses this internally to trigger events.

	myMyo.on('foobar', function(msg){
		console.log('wooooo', msg)
	});
	myMyo.trigger('foobar', 'ah yis!');


**zeroOrientation** &nbsp; `myo.zeroOrientation()` <br>
When called, where ever the Myo is orientated will now be the origin. This offset value will be stored at `myo.orientationOffset`.

**lock** &nbsp; `myo.lock()` <br>
Sends a command to Myo Connect to lock the device. This will stop the Myo from transmitting pose events.

**unlock** &nbsp; `myo.unlock(), Myo.unlock(true)` <br>
This will send a command to Myo Connect unlock the Myo. If `true` is passed it will send a timed unlock, where Myo Connect will unlock the Myo for ~2 seconds, then lock it. Myo.js uses this command internally when the locking policy is set to standard.

**vibrate** &nbsp; `myo.vibrate(), myo.vibrate('short' | 'medium' | 'long')` <br>
Makes the Myo vibrate with a given duration. Defaults to `'medium'`.

**requestBluetoothStrength** &nbsp; `myo.requestBluetoothStrength()` <br>
Requests the connection strength of the Myo to be sent. Listen to the `'bluetooth_strength'` event for the data.

	myMyo.on('bluetooth_strength', function(val){
		console.log('Such strength', val);
	});
	myMyo.requestBluetoothStrength();


**streamEMG** &nbsp; `myo.streamEMG(enabled)` <br>
Tells the Myo to start or stop streaming EMG data. Myo.js must have a connected socket for this to work. Pass nothing or `true` to enabled it and `false` to disabled it. Listen to the `emg` event for the data. **Note:** while streaming EMG data, gesture recognition might not be at it's best. This is being fixed in the near future.

	myMyo.on('connected', function(){
		myMyo.streamEMG(true);
	});
	myMyo.on('emg', function(data){
		console.log(data);
	});

Requests the connection strength of the Myo to be sent. Listen to the `'bluetooth_strength'` event for the data.

	myMyo.on('bluetooth_strength', function(val){
		console.log('Such strength', val);
	});
	myMyo.requestBluetoothStrength();



## events
You can create listeners to the events by using the `myo.on()` function. You can even fire your own events using `myo.trigger()`.

**connected** &nbsp; `myo.on('connected', function(){ ... })` <br>
Fired when the Myo is successfully connected with the Myo Connect software. Populates `myo.connect_version`.

**disconnected** &nbsp; `myo.on('disconnected', function(){ ... })` <br>
Fired when the Myo is disconnected from the Myo Connect software.

**arm_synced** &nbsp; `myo.on('arm_synced', function(){ ... })` <br>
Fired when the User puts on the Myo and successfully does the Setup Gesture. Populates `myo.arm` and `myo.direction`

**arm_unsynced** &nbsp; `myo.on('arm_unsynced', function(){ ... })` <br>
Fired when the User removes the Myo.

**imu** &nbsp; `myo.on('imu', function(data){ ... })` <br>
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

**emg** &nbsp; `myo.on('emg', function(data){ ... })` <br>
This event is fired whenever we receive EMG data from the Myo. In order to get this data you must first tell the myo you want it to stream EMG by using the `myo.streamEMG(true)` command. This data is an 8 element array (one for each pod) bounded from -127 to 127.

	myMyo.streamEMG(true);
	myMyo.on('emg', function(data){
		console.log(data);
	});

**gyroscope** &nbsp; `myo.on('gyroscope', function(data){ ... })` <br>
This event is fired whenever we receive gyroscopic data from the Myo. This data is grouped as 3d coordinates.

**orientation** &nbsp; `myo.on('orientation', function(data){ ... })` <br>
This event is fired whenever we receive orientation data from the Myo. This data is grouped as a quanternion.

**accelerometer** &nbsp; `myo.on('accelerometer', function(data){ ... })` <br>
This event is fired whenever we receive acceleration data from the Myo. This data is grouped as 3d coordinates.

**bluetooth_strength** &nbsp; `myo.on('bluetooth_strength', function(data){ ... })` <br>
Fired after `Myo.requestBluetoothStrength()` is called. Returns a percentage measure of the bluetooth strength the Myo is connected to.

**rssi** &nbsp; `myo.on('rssi', function(data){ ... })` <br>
Fired after `Myo.requestBluetoothStrength()` is called. Returns a measure of the bluetooth strength in dBm of the Myo is connected to.

**pose** &nbsp; `myo.on('pose', function(pose_name){ ... })` <br>
Whenever the Myo detects a pose change it will fire a `pose` event. The listener will be called with the `pose_name`. Myo.js will also fire an individual event for each pose. Here is a list of all the poses : `fingers_spread`,`wave_in`,`wave_out`,`fist`,`double_tap`.

	Myo.on('pose', function(pose_name){
		console.log('Started ', pose_name);
	});
	var myMyo = Myo.create();
	myMyo.on('wave_in', function(edge){
		Menu.left()
	})

**pose_off** &nbsp; `myo.on('pose_off', function(pose_name){ ... })` <br>
Whenever the Myo detects the end of a pose it will fire a `pose_off` event. The listener will be called with the `pose_name_off`. Myo.js will also fire an individual event for each pose. Here is a list of all the poses : `fingers_spread_off`,`wave_in_off`,`wave_out_off`,`fist_off`,`double_tap_off`.

	Myo.on('pose_off', function(pose_name){
		console.log('Ended ', pose_name);
	});

**rest** &nbsp; `myo.on('rest', function(){ ... })` <br>
The rest event is fired whenever the Myo does not detect any gestures.

**warmup_completed** &nbsp; `myo.on('warmup_completed', function(){ ... })` <br>
This will fire when the Myo is finished warming up. It will change it's `myo.warmupState` from `"cold"` to `"warm"`.


**lock** &nbsp; `myo.on('lock', function(){ ... })` <br>
Fired whenever `myo.lock()` is called. Useful for firing vibration events, or updating UI when the Myo becomes locked.

**unlock** &nbsp; `myo.on('unlock', function(){ ... })` <br>
Fired whenever `myo.unlock()` is called. Useful for firing vibration events, or updating UI when the Myo becomes unlocked.

**status** &nbsp; `myo.on('status', function(){ ... })` <br>
Fired whenever a non-pose, non-IMU, non-EMG event is fired. Useful for making debug windows, without being flooded by IMU events.
