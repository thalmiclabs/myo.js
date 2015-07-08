
Myo.connect();


Myo.on('connected', function(data){
	console.log('connected', this,  data);

	myo = this;

	addEvents(this);




})

Myo.on('status', function(data){
	console.log(data.type, data);
})


addEvents = function(myo){
	myo.on('pose', function(pose){
		console.log(pose);
	})

	myo.on('pose_off', function(pose){
		console.log(pose, 'off');
	})
}


console.log(Myo.myos[0]);






