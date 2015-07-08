Myo.connect();

Myo.on('status', function(data){
	$('.events').prepend(JSON.stringify(data, null, 2));
})

Myo.on('pose', function(pose){
	$('img.' + pose).attr('src', 'img/' + pose + '_active.png');
	$('.mainPose img').attr('src', 'img/' + pose + '_active.png');
})

Myo.on('pose_off', function(pose){
	$('img.' + pose).attr('src', 'img/' + pose + '.png');
	$('.mainPose img').attr('src', 'img/unlocked.png');
});

Myo.on('locked', function(){
	$('.mainPose img').attr('src', 'img/locked.png');
})

Myo.on('unlocked', function(){
	$('.mainPose img').attr('src', 'img/unlocked.png');
})
