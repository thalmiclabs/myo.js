var Myo = require('./myo');

var myo = Myo.create(0);

myo.on('connected', function(){

	console.log('connected');
})

myo.on('bluetooth_strength', function(BTS){
	var width = ((BTS * -1 - 40 ) / 50 ) * 100  + '%';
	console.log(width);
})

myo.on('double_tap', function(){
	myo.requestBluetoothStrength();
});

myo.on('pose', function(poseName, edge){
	if(edge) console.log(poseName);
})