
var slots = [];
for(var i =0; i<4;i++){
	var slotMyo = Myo.create({
		events : [],
		virtual : true,
		position : Myo.myos.length
	});
	slots.push(slotMyo);
	Myo.myos.push(slotMyo);
}

var transferSlot = function(index, proto){
	var temp = slots[index].events.slice(0);
	var pos = slots[index].position;
	slots[index] = Object.create(proto);
	slots[index].events = temp;
	slots[index].position = pos;
	slots[index].virtual = true;
	Myo.myos[pos] = slots[index];
}


Myo.on('arm_synced', function(){
	if(this.virtual) return;
	var slotNum;
	for(var i =0; i<4;i++){
		if(typeof slots[i].connectIndex === 'undefined'){
			slotNum = i;
			break;
		}
	}
	if(typeof slotNum !=='undefined'){
		transferSlot(slotNum, this);
		slots[slotNum].trigger('arm_synced');
	}
});

Myo.on('arm_unsynced', function(data){
	if(this.virtual) return;
	var slotNum;
	for(var i =0; i<4;i++){
		if(slots[i].connectIndex === this.connectIndex){
			slotNum = i;
			break;
		}
	}
	if(typeof slotNum !=='undefined') transferSlot(slotNum, Object.create(Myo.methods));
});




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

Myo.connect();


Myo.on('pose', function(pose){
	//console.log('global', this.name, pose);
})


slots[0].on('pose', function(pose){
	console.log('slot0', this.name, pose);
})

slots[0].on('arm_synced', function(){
	console.log('slot0 sync!');
});

slots[0].on('arm_unsynced', function(){
	console.log('slot0 unsync');
})


slots[1].on('pose', function(pose){
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