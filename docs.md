<h1 align="center">
  documentation
</h1>

## myo core

| name                 | call                               | description |
| --- | --- | --- |
| **myos**             | `Myo.myos`                         | An array containing the created Myo instances when a Myo pairs with Myo Connect |
| **create**           | `Myo.create(), Myo.create(data)`   | Creates and returns a new Myo instance. `data` can be an object which will be merged onto the instance. This command is generally not needed, as Myo.js will create instances for every paired Myo on your computer automatically.
| **on**               | `Myo.on(event, callback)`          | Creates a global listener for each Myo instance for the given event. The `callback`'s context will be the Myo instance. |
| **off**              | `Myo.off(eventName)`               | Removes a create global listener. |
| **trigger**          | `Myo.trigger(eventName)`           | Triggers a create global event which all myos within the `Myo.myos` array will respond to. |
| **setLockingPolicy** | `Myo.setLockingPolicy(policyType)` | Sets the locking policy in Myo Connect. Can either be `"standard"` or `"none"`. Standard will automatically lock the Myo after a while, while None will constantly stream events regardless of lock state. |
| **connect**          | `Myo.connect(appId)`               | Creates web socket and sets up the message listener. |
| **disconnect**       | `Myo.disconnect()`                 | Closes the web socket. |
| **onError**          | `Myo.onError`                      | `Myo.onError` is triggered whenever Myo.js can't establish a connection to Myo Connect. This could be that it's not running, or that your API version is out of date. You can override this function with a function of your choice. |
| **methods**          | `Myo.methods`                      | `methods` is an object of functions that will be added to each myo instance when it is created. If you are making an add-on you may want to add your own functions to this object. |

#### core extended examples

###### `Myo.on`:

```javascript
Myo.on('connected', function(){
  console.log('connected!', this.id)
});
```

Every event is sent with a timestamp in microseconds. Thus, the full signature of the 'connected' event above, would look like this:

```javascript
Myo.on('connected', function(data, timestamp){
    console.log('connected!', this.id)
});
```

Of course, declaration of parameters are optional in callbacks.

###### `Myo.onError`:

```javascript
Myo.methods.helloWorld = function(){
  console.log('Hello ' + this.name);
}
Myo.connect('com.stolksdorf.myAwesomeApp');
Myo.myos[0].helloWorld();
```

## myo data
| name | call | description |
| --- | --- | --- |
| **arm** | `Myo.arm` | Stores which arm the Myo is being worn on. Either `"left"` or `"right"` |
| **batteryLevel** | `Myo.batteryLevel` | Stores the last recorded battery level from the device. Range from 0 to 100. |
| **connected** | `Myo.connected` | Stores a boolean on whether the Myo is currently connected. |
| **connectIndex** |`Myo.connectIndex ` | This index is used to listen and send specific messages to Myo Connect. |
| **connectVersion** | `Myo.connectVersion` | Stores the version of Myo Connect. |
| **direction** | `Myo.direction ` | Stores the direction that the User is wearing the Myo. Can either be `"toward_elbow"` or `"toward_wrist"`, referencing the Thalmic logo on the device. |
| **lastIMU** | `Myo.lastIMU` | Stores the last IMU object. Useful when you need to look at changes over time. |
| **locked** | `Myo.locked` | Stores a boolean on whether the Myo is currently locked. |
| **macAddress** | `Myo.macAddress` | Stores the macAddress of the Myo. |
| **name** | `Myo.name ` | Stores the name of the Myo. |
| **orientationOffset** | `Myo.orientationOffset` | Stores the offset quaternion used with `Myo.zeroOrientation()`. |
| **synced** | `Myo.synced` | Stores a boolean on whether the Myo is currently synced. |
| **warmupState** | `Myo.warmupState` | Stores the warmup state of the Myo. Either `"cold"` or `"warm"` |

## myo functions
| name | call | description |
| --- | --- | --- |
| **lock** | `Myo.lock()` | Sends a command to Myo Connect to lock the device. This will stop the Myo from transmitting pose events. |
| **on** | `Myo.on(eventName, function(arg1, arg2,...)) ` | On sets up a listener for a specific event name. Whenever that event is triggered, each function added with `on()`, will be called with whatever arguments `trigger()` was called with. Returns a unique event id for this listener. |
| **requestBatteryLevel** | `Myo.requestBatteryLevel()` | Requests the current battery level of the Myo. Listen to the `'battery_level'` event for the data. |
| **requestBluetoothStrength** | `Myo.requestBluetoothStrength()` | Requests the connection strength of the Myo to be sent. Listen to the `'bluetooth_strength'` event for the data. |
| **streamEMG** | `Myo.streamEMG(enabled)` | Tells the Myo to start or stop streaming EMG data. Myo.js must have a connected socket for this to work. Pass nothing or `true` to enabled it and `false` to disabled it. Listen to the `emg` event for the data. **Note**: while streaming EMG data, gesture recognition might not be at it's best. This is being fixed in the near future. |
| **trigger** | `Myo.trigger(eventName, arg1, arg2, ...)` | Trigger activates each listener for a specific event. You can add any additional parameters to be passed to the listener. Myo.js uses this internally to trigger events. |
| **unlock** | `Myo.unlock(), Myo.unlock(true)` | This will send a command to Myo Connect unlock the Myo. If `true` is passed it will send a timed unlock, where Myo Connect will unlock the Myo for ~2 seconds, then lock it. Myo.js uses this command internally when the locking policy is set to standard. |
| **vibrate** | `Myo.vibrate(), Myo.vibrate('short', 'medium', 'long')` | Makes the Myo vibrate with a given duration. Defaults to `'medium'`. |
| **zeroOrientation** | `Myo.zeroOrientation()` | When called, where ever the Myo is orientated will now be the origin. This offset value will be stored at `Myo.orientationOffset`. |

#### functions extended examples

###### Myo.on

```javascript
myMyo.on('fist', function(){
    console.log('fist pose start');
});
myMyo.on('fist_off', function(){
    console.log('fist pose end');
});
```

###### `Myo.requestBatteryLevel`

```javascript
myMyo.on('battery_level', function(val){
    console.log('Much power', val);
});
myMyo.requestBatteryLevel();
```

###### `Myo.requestBluetoothStrength`

```javascript
myMyo.on('bluetooth_strength', function(val){
    console.log('Such strength', val);
});
myMyo.requestBluetoothStrength();
```

###### `Myo.streamEMG`

```javascript
myMyo.on('connected', function(){
    myMyo.streamEMG(true);
});
myMyo.on('emg', function(data){
    console.log(data);
});
```

###### `Myo.trigger`

```javascript
myMyo.on('foobar', function(msg){
    console.log('wooooo', msg)
});
myMyo.trigger('foobar', 'ah yis!');
```

## myo events

You can create listeners to the events by using the `Myo.on()` function. You can even fire your own events using `Myo.trigger()`.

| name | call | description |
| --- | --- | --- |
| **accelerometer** | `Myo.on('accelerometer', function(data){ ... })` | This event is fired whenever we receive acceleration data from the Myo. This data is grouped as 3d coordinates. |
| **arm_synced** | `Myo.on('arm_synced', function(){ ... })` | Fired when the User puts on the Myo and successfully does the Setup Gesture. Populates `Myo.arm` and `Myo.direction`. |
| **arm_unsynced** | `Myo.on('arm_unsynced', function(){ ... })` | Fired when the User removes the Myo. |
| **bluetooth_strength** | `Myo.on('bluetooth_strength', function(data){ ... })` | Fired after `Myo.requestBluetoothStrength()` is called. Returns a percentage measure of the bluetooth strength the Myo is connected to. |
| **connected** | `Myo.on('connected', function(){ ... })` | Fired when the Myo is successfully connected with the Myo Connect software. Populates `Myo.connect_version`. |
| **disconnected** | `Myo.on('disconnected', function(){ ... })` | Fired when the Myo is disconnected from the Myo Connect software. |
| **emg** | `Myo.on('emg', function(data){ ... })` | This event is fired whenever we receive EMG data from the Myo. In order to get this data you must first tell the myo you want it to stream EMG by using the `Myo.streamEMG(true)` command. This data is an 8 element array (one for each pod) bounded from -127 to 127. |
| **gyroscope** | `Myo.on('gyroscope', function(data){ ... })` | This event is fired whenever we receive gyroscopic data from the Myo. This data is grouped as 3d coordinates. |
| **imu** | `Myo.on('imu', function(data){ ... })` | This event is fired whenever we receive IMU data from the Myo. |
| **lock** | `Myo.on('lock', function(){ ... })` | Fired whenever `Myo.lock()` is called. Useful for firing vibration events, or updating UI when the Myo becomes locked. |
| **orientation** |  `Myo.on('orientation', function(data){ ... })` | This event is fired whenever we receive orientation data from the Myo. This data is grouped as a quanternion. |
| **pose** | `Myo.on('pose', function(pose_name){ ... })` | Whenever the Myo detects a pose change it will fire a pose event. The listener will be called with the pose_name. Myo.js will also fire an individual event for each pose. Here is a list of all the poses: `fingers_spread`, `wave_in`, `wave_out`,`fist`, `double_tap`. |
| **pose_off** | `Myo.on('pose_off', function(pose_name){ ... })` | Whenever the Myo detects the end of a pose it will fire a pose_off event. The listener will be called with the pose_name_off. Myo.js will also fire an individual event for each pose. Here is a list of all the poses : `fingers_spread_off`, `wave_in_off`, `wave_out_off`, `fist_off`, `double_tap_off`. |
| **rest** | `Myo.on('rest', function(){ ... })` | The rest event is fired whenever the Myo does not detect any gestures. |
| **rssi** | `Myo.on('rssi', function(data){ ... })` | Fired after `Myo.requestBluetoothStrength()` is called. Returns a measure of the bluetooth strength in dBm of the Myo is connected to. |
| **status** | `Myo.on('status', function(){ ... })` | Fired whenever a non-pose, non-IMU, non-EMG event is fired. Useful for making debug windows, without being flooded by IMU events. |
| **unlock** | `Myo.on('unlock', function(){ ... })` | Fired whenever `Myo.unlock()` is called. Useful for firing vibration events, or updating UI when the Myo becomes unlocked. |
| **warmup_completed** | `Myo.on('warmup_completed', function(){ ... })`  |This will fire when the Myo is finished warming up. It will change it's `Myo.warmupState` from `"cold"` to `"warm"`. |

#### events examples extended

###### `Myo.on('emg', function(data){ ... })`

```javascript
myMyo.streamEMG(true);
myMyo.on('emg', function(data){
    console.log(data);
});
```

###### `Myo.on('imu)', function(data){ ... })`

This data is grouped like this:

```javascript
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
```

###### `Myo.on('pose', function(post_name){ ... })`

```javascript
Myo.on('pose', function(pose_name){
    console.log('Started ', pose_name);
});
var myMyo = Myo.create();
myMyo.on('wave_in', function(edge){
    Menu.left()
})
```

###### `Myo.on('pose_off', function(pose_name){ ... })`

```javascript
Myo.on('pose_off', function(pose_name){
    console.log('Ended ', pose_name);
});
```
