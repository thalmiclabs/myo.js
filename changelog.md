# Changelog

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