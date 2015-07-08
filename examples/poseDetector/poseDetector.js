

console.log(Myo.myos);

//Myo.initSocket();


Myo.on('connected', function(myo){
	console.log('connected', myo);
})

Myo.on('status', function(data){
	console.log(data.type, data);
})










