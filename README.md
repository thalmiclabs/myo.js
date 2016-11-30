# myo.js
[![NPM](https://nodei.co/npm/myo.png)](https://nodei.co/npm/myo/)

Myo javascript bindings.

Myo.js allows you to interact with Thalmic Labs's [Myo Gesture Control Armband](http://myo.com) using websockets. Listen for IMU, EMG, and gesture events, as well as controlling vibration and locking.

## installation
On the browser, just include the `myo.js` file in your project. `Myo` will be global.

On node.js

	npm install myo ws


## getting started
You'll need a [Myo](http://myo.com) and [Myo Connect](https://developer.thalmic.com/downloads)

##### Client-side

```javascript
Myo.connect('com.stolksdorf.myAwesomeApp');

Myo.on('fist', function(){
	console.log('Hello Myo!');
	this.vibrate();
});
```

##### Node

```javascript
var Myo = require('myo');

Myo.connect('com.stolksdorf.myAwesomeApp', require('ws'));

Myo.on('fist', function(){
	console.log('Hello Myo!');
	this.vibrate();
});
```


## myo lifecycle
A myo can be **paired**, **connected**, and/or **synced**.

A myo is **paired** if it's ever been connected to your computer. You can see a list of paired myos in Myo Connect's armband manager. When `Myo.connect()` is called, Myo.js will create a myo instance for every paired Myo on your computer and store them in `Myo.myos` array.

A myo is **connected** if it's turned on and connected to your computer over bluetooth. It can send over IMU events at this point, vibrate, and EMG (if `myo.streamEMG(true)` is called) but not poses since it's not synced with the user.

A myo is **synced** when the user puts it on and does the sync gesture. At this point it will start sending over pose and lock/unlock events.




## branding and assets
You can use assets provided in our [branding](https://developer.thalmic.com/branding/) and [UX](https://developer.thalmic.com/ux/) guidelines.

## documentation
You can read the full documention in [docs.md](docs.md)

## changelog
Releases are documented in [changelog.md](changelog.md)

## license
The Myo.js project is licensed using the modified BSD license. For more details, please see [LICENSE.txt](LICENSE.txt).

### thanks
Thanks to [stolksdorf](https://github.com/stolksdorf) for creating Myo.js
