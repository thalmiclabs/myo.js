# Changelog

### 3.0.0 - Wednesday, 30/11/2016
- There were issues with Browserify-ing the library, specifically in regards to the `ws` lib
- Removing the explicit dependacy on the `ws` lib, since it's not needed if the library is being used client-side
- If developing in node, you must pass in `ws` as a second parameter on `myo.connect`
- Added warnings explaining how to solve them if the lib is not provided.

### 2.1.2
- Fixed pairing to avoid duplicated myo on reconnect (Thanks u/Ucodia!)
- Updated `ws` lib to work with node v6 and higher (Thanks u/JoshuaJi!)

### 2.1.0 - Monday, 21/09/2015
* Added an appId query param to the web socket. This can be set through the `Myo.connect(APP_ID)` command and is stored at `Myo.defaults.app_id`. This app id is to help Thalmic track usage stats from different apps and to help us a bit with reporting if there's issues. If no appId is provided it will default to `com.myojs.default`, so this change won't break current applications using Myo.js

### 2.0.2 - Tuesday, 21/07/2015
* Added the ability to pass `false` to `.off()` to remove all events

### 2.0.1 - Tuesday, 21/07/2015
* Left out `.requestBatteryLevel()` during the v2 overhaul

### 2.0.0 - Wednesday, 08/07/2015
* Dramatically changed the way Myo.js creates myo instances. No more code needed! The library will create the instances for you as they are paired.
* Hiding the need for the developer to worry about the Myo index value in Myo Connect. Myo.js now uses mac addresses as the main form of Myo id
* Renamed `Myo.initSocket()` to `Myo.connect()` and added `Myo.disconnect()` to close the web socket
* Renamed `Myo.options` to `Myo.defaults`
* Removed `myo.timer()`
* Fixed `myo.setLockingPolicy()` and moved it onto the core object `Myo`, since it controls the locking policy for all Myos.
* Simplified the `myo.unlock()` command. Now takes a single boolean parameter to toggle betwen doing a timed unlock or a held unlock.
* Pose events now implicitly call `.unlock(true)` while held and `.unlock()` on release, if locking policy is `standard`. This mimics the behaviour of most other Myo apps.
* Removed `rest` from being a pose
* Removed edges from pose events. Added `_off` events to replace it. eg. `fist` and `fist_off`, `pose` and `pose_off`
* Adding events for when the socket is ready and when the socket has closed. `ready` and `socket_closed` respectively
* Now tracking battery level on the Myo instance. `myo.batteryLevel`
* Added `.off()` to the core Myo object to turn off global events.
* `myo.off()` now returns the Myo instance for chaining.
* Now tracking warmup state on the myo instance. `myo.warmupState`
* Fires event of `warmup_completed` when the myo has fully warmed up.
* `bluetooth_strength` event now emits a percentage.
* Added a `rssi` event that emits the dBm of the bluetooth signal.
* Created a `methods` object on the Myo library to let developers add custom functions to myo instances. This object will be used as the prototype of all myo instances.
* Modifed the parameters on the `Myo.create()` call. It's also now not needed, but leaving it exposed for other add-ons to use.
* Added a `myo.synced` flag to easily see which myos are synced with an arm or not.





### 1.5.0 - Thursday, 19/03/2015
* Added a `Myo.onError` function you can overwrite which will trigger if Myo.js can't make a connection with Myo Connect.
* Creating mutliple instances of a myo with the same id won't clobber connection information now.
* Adding a new `status` event that gets triggered for any non-pose, non-IMU, and non-EMG event from the Myo. Useful for debug windows. This will also future-proof the library if new Myo Connect events get added.
* On connect Myo.js now merges in all values from the data packet into the myo object. This is to future-proof additional properities Myo Connect may return.
* The catch-all event `*` now doesn't modify the arguments object.



### 1.4.0 - Tuesday, 03/03/2015
* Moved repo and npm module over to ThalmicLabs
* Improved the doc structure (again)
* Moved the existing issues over
* Updated the locking policy (thanks andrebower!)
* Added better quaternion math (thanks freehaha!)

### 1.3.0 - Sunday, 08/02/2015
* Better doc structure
* Merged in BrianHeese's pull request for the locking policy change (thanks!)

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