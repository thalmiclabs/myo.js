


Myo.connect();


Myo.on('connected', function(myo){
	console.log('connected', myo);


})

Myo.on('status', function(data){
	console.log(data.type, data);
})



console.log(Myo.myos[0]);






