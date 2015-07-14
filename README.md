# myo.js
[![NPM](https://nodei.co/npm/myo.png)](https://nodei.co/npm/myo/)

Myo javascript bindings.

Myo.js allows you to interact with Thalmic Labs's [Myo Gesture Control Armband](http://myo.com) using websockets. Listen for IMU, EMG, and gesture events, as well as controlling vibration and locking.

# installation
On the browser, just include the `myo.js` file in your project. `Myo` will be global.

On node.js

	npm install myo


# getting started
You'll need a [Myo](http://myo.com) and [Myo Connect](https://developer.thalmic.com/downloads)

	var Myo = require('myo');

	Myo.on('fist', function(){
		console.log('Hello Myo!');
		this.vibrate();
	});






# usage

### creating a myo instance

The Myo.js library can be access through the `Myo` variable. This is the core library and be used to create new Myo instances, trigger global events, amongst other things. To create a new Myo object use the `Myo.create()` function. This function can two parameters: an id (used for multi-Myo support), and specific options for that Myo.

	var myMyo = Myo.create(); //Defaults to id 0
	//Make this Myo a bit more sensitive
	var thirdMyo = Myo.create(2, {armbusy_threshold : 10});

Commands and events used with these instances are specific to that Myo. You can create Myo instances for Myo that aren't connected yet. For example if your app uses an optional second Myo, create two instances, and listen for the `connected` event on the second one to enable dual Myo support.


### creating listeners

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


### locking

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

### locking policy

The Myo now has a built in locking policy. The policy can be set by using `.setLockingPolicy`. Supported are "none" and "standard". Note that the `.lock()` call does not lock the Myo if the policy is set to "none"!

	//Example for setting locking policy
	myo.on('connected', function () {
		myo.setLockingPolicy('none');
	});

	// Implement your own locking. Example: (Handle locking yourself like described above!!!!)
	myo.on('double_tap', function (edge) {
		if(edge){
			if(!myo.isLocked)  {
				console.log("Lock");
				myo.lock();
			}else {
				console.log("Unlock");
				myo.unlock();
			}
		}
	});




# documentation
You can read the full documention [here](docs.md)

# changelog
Releases are documented in [changelog.md](changelog.md)

# branding and assets
You can use assets provided in our [branding](https://developer.thalmic.com/branding/) and [UX](https://developer.thalmic.com/ux/) guidelines.

# thanks
Thanks to [stolksdorf](https://github.com/stolksdorf) for creating Myo.js

## license

The Myo.js project is licensed using the modified BSD license. For more details, please see LICENSE.txt.