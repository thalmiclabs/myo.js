Note : If you are a bleeding-edge kind of developer, be sure to check out the [Experimental](https://github.com/stolksdorf/myo.js/tree/master/experimental) Myo.js features!

Like node? We do too. `npm install myo` will do what you need. [Check it out!](https://www.npmjs.org/package/myo)

# Myo.js

Myo.js allows website and javascript application talk with your Myo over websockets on both the client and node.js applications.


## Getting Started

To start you need two things : Your very own Myo, and [Myo Connect Software](https://developer.thalmic.com/downloads). This software will run on your computer, and talk with the Myo. From here you can manage your connected myos, load in Lua scripts, and test out the pose recognition.

Once those and installed and setup, you can just drop the Myo.js library into a webpage and start developing with Myo. Any user with Myo Connect running that visits your webpage/runs your app can user their Myo with your application.

Try this out!

	var myMyo = Myo.create();
	myMyo.on('fingers_spread', function(edge){
		if(!edge) return;
		alert('Hello Myo!');
		myMyo.vibrate();
	});

## Creating a Myo Instance

The Myo.js library can be access through the `Myo` variable. This is the core library and be used to create new Myo instances, trigger global events, amongst other things. To create a new Myo object use the `Myo.create()` function. This function can two parameters: an id (used for multi-Myo support), and specific options for that Myo.

	var myMyo = Myo.create(); //Defaults to id 0
	//Make this Myo a bit more sensitive
	var thirdMyo = Myo.create(2, {armbusy_threshold : 10});

Commands and events used with these instances are specific to that Myo. You can create Myo instances for Myo that aren't connected yet. For example if your app uses an optional second Myo, create two instances, and listen for the `connected` event on the second one to enable dual Myo support.


## Creating Listeners

Myo.js is all about events. Whenever we receive data from the Myo, we'll filter through and emit contextual events. You create listeners to these events using the `myo.on()` function.

	myMyo.on('fist', function(edge){
		//Edge is true if it's the start of the pose, false if it's the end of the pose
		if(edge){
			enemies.crush();
		}
	});
	myMyo.on('gyroscope', function(data){
		if(data.x > 100){
			alert('Woah now!')
		}
	});


## Simple Actions

Here are some techniques to get you started.

### Holding Poses

To reduce the number of false positives, it's useful to react when the user holds a pose, rather than as soon as it's fired. We've provided a handy function, `myo.timer()` to make writing this as easy as possible. The function takes three parameters: A boolean to turn the timer off and on, a duration in milliseconds, and a function to run.

	//After holding thumb to pinky for 1/2 a second, the Myo will be unlocked for 2 seconds
	myMyo.on('thumb_to_pinky', function(edge){
		myMyo.timer(edge, 500, function(){
			myMyo.unlock(2000);
		})
	});

### Locking

For more passive apps, it's useful to "lock" and "unlock" the Myo so that accidental actions aren't picked up. We provide `.lock()` and `.unlock()` functions, `lock` and `unlock` events, and a `myo.isLocked` boolean. Myo.js doesn't implement any logic for locking and unlocking the Myo, that's up to you.

	//Thumb to pinky will unlock the Myo for 2 seconds
	// Wave out will make the menu go left, only if the Myo is unlocked,
	// also resets the relock for 5 seconds
	// The Myo will vibrate on lock and unlock.
	myMyo.on('thumb_to_pinky', function(edge){
		myMyo.unlock(2000);
	});
	myMyo.on('wave_out', function(edge){
		if(edge && !myMyo.isLocked){
			menu.left()
			myMyo.unlock(5000);
		}
	});
	myMyo.on('unlock', function(){
		myMyo.vibrate();
	});
	myMyo.on('lock', function(){
		myMyo.vibrate('short').vibrate('short');
	});

## Node support

Myo.js also works on node! It uses the [ws](https://www.npmjs.org/package/ws) package for doing WebSockets. You have to do nothing extra, Myo.js will figure out if it's on a server or not and run accordingly. `npm install myo` will do what you need. [Check it out!](https://www.npmjs.org/package/myo)


## Final Touches

Before you run off and built a Minority Report like interface, be sure to skim the reference below to see everything your Myo can do. If your itching for some assets and images to use you can grab our [branding](https://developer.thalmic.com/branding/) and [UX](https://developer.thalmic.com/ux/) guidelines here. Have fun!


# Reference

## Myo Core

**options** &nbsp; `Myo.options` <br>
Here you can review and set the default options that will be used for each Myo instance.

**myos** &nbsp; `Myo.myos` <br>
An array containing the created Myo instances indexed by their id.

**create** &nbsp; `Myo.create(), Myo.create(id), Myo.create(opts), Myo.create(id, opts)` <br>
Creates and returns a new Myo instance. If no `id` is provided, defaults to 0. `opts` provided will overwrite the default options.

	var myMyo = Myo.create();
	var thirdMyo = Myo.create(2, {armbusy_threshold : 10});

**on** &nbsp; `Myo.on(eventName, callback)` <br>
Creates a global listener for each Myo instance for the given event. The `callback`'s context will be the Myo instance.

	Myo.on('connected', function(){
		console.log('connected!', this.id)
	});

**initSocket** &nbsp; `Myo.initSocket()` <br>
Creates web socket and sets up the message listener. Called implictly whenever you create a new myo instance.

## Myo Instance
A Myo instance is an individual Myo create using this library.

### Data
**id** &nbsp; `myo.id` <br>
Stores the id of the Myo.

**connect_verion** &nbsp; `myo.connect_verion` <br>
Stores the version of Myo Connect.

**direction** &nbsp; `myo.direction` <br>
Stores the direction that the User is wearing the Myo. Can either be `"toward_elbow"` or `"toward_wrist"`, referencing the Thalmic logo on the device.

**arm** &nbsp; `myo.arm` <br>
Stores which arm the Myo is being worn on. Either `"left"` or `"right"`

**orientationOffset** &nbsp; `myo.orientationOffset` <br>
Stores the offset quaternion used with `myo.zeroOrientation()`.

**lastIMU** &nbsp; `myo.lastIMU` <br>
Stores the last IMU object. Useful when you need to look at changes over time.

**isConnected** &nbsp; `myo.isConnected` <br>
Stores a boolean on whether the Myo is currently connected.

**isLocked** &nbsp; `myo.isLocked` <br>
Stores a boolean on whether the Myo is currently locked.

### Functions

**on** &nbsp; `myo.on(eventName, function(arg1, arg2,...))` <br>
On sets up a listener for a specific event name. Whenever that event is triggered, each function added with `on()`, will be called with whatever arguments `trigger()` was called with. Returns a unique event id for this listener.

	myMyo.on('fist', function(edge){
		if(edge)  console.log('fist pose start');
		if(!edge) console.log('fist pose end');
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
Sets `Myo.isLocked` to true and fires the `lock` event. Myo.js does nothing with `myo.isLocked`, it's up to the developer to implement locking features. For example:

	myMyo.on('fist', function(edge){
		if(Myo.isLocked || !edge) return;
		Enemies.smash();
	});

**unlock** &nbsp; `myo.unlock(), Myo.unlock(timeout)` <br>
Sets `Myo.isLocked` to false and fires the `unlock` event. If a `timeout` is passed in, it will call `myo.lock()` after the timeout has passed. Subsequient calls will reset the timeout.

	myMyo.unlock(); //Will unlock the Myo indefinitely
	myMyo.unlock(1000); //Unlocks the Myo, but will relock after 1 second

**vibrate** &nbsp; `myo.vibrate(), myo.vibrate('short' | 'medium' | 'long')` <br>
Makes the Myo vibrate with a given duration. Defaults to `'medium'`.

**requestBluetoothStrength** &nbsp; `myo.requestBluetoothStrength()` <br>
Requests the connection strength of the Myo to be sent. Listen to the `'bluetooth_strength'` event for the data.

	myMyo.on('bluetooth_strength', function(val){
		console.log('Such strength', val);
	});
	myMyo.requestBluetoothStrength();


**streamEMG** &nbsp; `myo.streamEMG(enabled)` <br>
Tells the Myo to start or stop streaming EMG data. Pass nothing or `true` to enabled it and `false` to disabled it. Listen to the `emg` event for the data. **Note:** while streaming EMG data, gesture recognition might not be at it's best. This is being fixed in the near future.

	myMyo.streamEMG(true);
	myMyo.on('emg', function(data){
		console.log(data);
	});

Requests the connection strength of the Myo to be sent. Listen to the `'bluetooth_strength'` event for the data.

	myMyo.on('bluetooth_strength', function(val){
		console.log('Such strength', val);
	});
	myMyo.requestBluetoothStrength();

**timer** &nbsp; `myo.timer(on_off, duration, callback)` <br>
Timer is useful for when you want a simple timeout for an action, such as holding a gesture for a period of time. `on_off` is a boolean that will create or disable the current timer with a duration of `duration` that will fire the `callback`.

	//Fires a spread_hold event if spread is held for half a second
	myMyo.on('fingers_spread', function(edge){
		myMyo.timer(edge, 500, function(){
			myMyo.trigger('spread_hold')
		})
	})



## Events
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
Fired after `Myo.requestBluetoothStrength()` is called. Returns a measure of the bluetooth strength the Myo is connected to.

**pose** &nbsp; `myo.on('pose', function(pose_name, edge){ ... })` <br>
Whenever the Myo detects a pose change it will fire a `pose` event. The listener will be called with the `pose_name` and the `edge` which will be `true` if it is the start of the pose and `false` if it is the end of the pose. Myo.js will also fire an individual event for each pose with the `edge` as the only parameter for the listener. Here is a list of all the poses : `rest`,`fingers_spread`,`wave_in`,`wave_out`,`fist`,`thumb_to_pinky`.

	Myo.on('pose', function(pose_name, edge){
		if(pose_name != 'rest' && edge){
			console.log('Started ', pose_name);
		}
	});
	var myMyo = Myo.create();
	myMyo.on('wave_in', function(edge){
		if(edge) Menu.left()
	})

**lock** &nbsp; `myo.on('lock', function(){ ... })` <br>
Fired whenever `myo.lock()` is called. Useful for firing vibration events, or updating UI when the Myo becomes locked.

**unlock** &nbsp; `myo.on('unlock', function(){ ... })` <br>
Fired whenever `myo.unlock()` is called. Useful for firing vibration events, or updating UI when the Myo becomes unlocked.


# Changelog

### 1.2.0 - Friday, 19/12/2014
* Added raw EMG support!
* Added a new EMG example
* Happy Holidays!

### 1.1.2 - Friday, 05/12/2014
* Added a second data parameter to most events
* Added a nice example showing off graphing IMU data and event streams
* Removed the empty Myo.ui stuff

### 1.1.1 - Thursday, 04/12/2014

* Renamed `arm_recognized` event to `arm_synced`
* Renamed `arm_lost` event to `arm_unsynced`
* Updated `Myo.options.api_version` to `3` to work with the newly released firmware.

### 1.1.0 - Monday, 17/11/2014

* Renamed `Myo.start()` to `Myo.initSocket()`
* Myo.js now tries to create the socket when you create Myo instances. This allows developers to modify `Myo.options` before the socket is created. Useful for controlling API versions.
* Added error handling messages on the socket.
* Updated `Myo.options.api_version` to `2` to work with the newly released firmware.
