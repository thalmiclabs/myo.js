
Myo.methods.test = function(){
	console.log(this.macAddress);
}


//This tells Myo.js to create the web sockets needed to communnicate with Myo Connect
Myo.connect();

Myo.on('arm_synced', function(data){
	for(var i =0; i < 4; i++){
		if(typeof slot[i].connectIndex === 'undefined'){
			slot[i].connectIndex = this.connectIndex;
			slot[i].name = this.name;
			slot[i].macAddress = this.macAddress;

			console.log(this.name, 'synced in slot ' + i);
			i = 100;
		}
	}
})
Myo.on('arm_unsynced', function(data){
	slot.map(function(slotMyo, index){
		if(data.myo == slotMyo.connectIndex){
			console.log(slotMyo.name, 'remove from slot ' + index);
			slot[index].connectIndex = undefined;
			slot[index].name = undefined;
			slot[index].macAddress = undefined;

		}
	})
})


var slot = [
	Myo.create(),
	Myo.create(),
	Myo.create(),
	Myo.create()
];


slot[0].on('pose', function(pose){
	console.log('slot0', this.name, pose);
})
slot[1].on('pose', function(pose){
	console.log('slot1', this.name, pose);
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