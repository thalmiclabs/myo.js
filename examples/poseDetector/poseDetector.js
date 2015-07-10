
Myo.methods.test = function(){
	console.log(this.macAddress);
}

Myo.syncedMyos = [
Myo.create({isVirtual : true}),
Myo.create({isVirtual : true}),
Myo.create({isVirtual : true}),
Myo.create({isVirtual : true})
]

//This tells Myo.js to create the web sockets needed to communnicate with Myo Connect
Myo.connect();

/*
Myo.on('arm_synced', function(data){
	for(var i =0; i < 4; i++){
		if(typeof Myo.syncedMyos[i].connectIndex === 'undefined'){
			Myo.syncedMyos[i].connectIndex = this.connectIndex;
			Myo.syncedMyos[i].name = this.name;
			Myo.syncedMyos[i].macAddress = this.macAddress;


			Myo.syncedMyos[i].trigger('arm_synced');

			console.log(this.name, 'synced in slot ' + i);
			i = 100;
		}
	}
})
Myo.on('arm_unsynced', function(data){
	Myo.syncedMyos.map(function(slotMyo, index){
		if(data.myo == slotMyo.connectIndex){
			console.log(slotMyo.name, 'remove from slot ' + index);
			Myo.syncedMyos[index].connectIndex = undefined;
			Myo.syncedMyos[index].name = undefined;
			Myo.syncedMyos[index].macAddress = undefined;

		}
	})
})

*/




///////////////////////////////


Myo.on('pose', function(pose){
	//console.log('global', this.name, pose);
})


Myo.syncedMyos[0].on('pose', function(pose){
	console.log('slot0', this.name, pose);
})

Myo.syncedMyos[0].on('arm_synced', function(){
	console.log('aww yeah');
})






/*
Myo.on('status', function(data){
	$('.events').prepend(JSON.stringify(data, null, 2));
})


//Whenever we get a pose event, we'll update the image sources with the active version of the image
Myo.on('pose', function(pose){
	$('img.' + pose).attr('src', 'img/' + pose + '_active.png');
	$('.mainPose img').attr('src', 'img/' + pose + '_active.png');
})

//Opposite of above. We also revert the main img to the unlocked state
Myo.on('pose_off', function(pose){
	$('img.' + pose).attr('src', 'img/' + pose + '.png');
	$('.mainPose img').attr('src', 'img/unlocked.png');
});



Myo.on('locked', function(){
	$('.mainPose img').attr('src', 'img/locked.png');
});
Myo.on('unlocked', function(){
	$('.mainPose img').attr('src', 'img/unlocked.png');
});
*/