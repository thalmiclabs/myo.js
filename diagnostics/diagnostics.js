
var myoId = 0;
$('#myoSelect').change(function(){
	myoId = $(this).val();
	$('#events').html("");
})

var makeHistory = function(count, obj){
	var result =[];
	for(var i=0; i<count; i++){
		result.push(obj)
	}
	return result;
}

var createGraph = function(containerElementId, initialData, ranges){
	var plot = $.plot(containerElementId, getData(myoHistory.orientation), {
		series: {shadowSize: 0},
		yaxis : {
			min : ranges[0],
			max : ranges[1]
		}
	});

	var history = {

	}
	return {
		plot : plot,
		addData : function(dataPoint){
			data = getData(myoHistory[type])
			plot.setData(data);
			plot.draw();
		},
		clearData : function(){

		}
	}
}


//Myo.options.armbusy_threshold = 20;
var maGyro = 0;

var myoHistory_size = 100;
var myoHistory = {
	pose : [],
	orientation : makeHistory(myoHistory_size,{x:0,y:0,z:0,w:0}),
	accelerometer : makeHistory(myoHistory_size,{x:0,y:0,z:0}),
	gyroscope : makeHistory(myoHistory_size,{x:0,y:0,z:0,ema:0})
};


Myo.on('imu', function(data){
	if(this.id != myoId) return;

	myoHistory.orientation.push(data.orientation);
	myoHistory.orientation = myoHistory.orientation.slice(1);
	myoHistory.accelerometer.push(data.accelerometer);
	myoHistory.accelerometer = myoHistory.accelerometer.slice(1);


	data.gyroscope.ema = Myo.armBusyData;

	myoHistory.gyroscope.push(data.gyroscope);
	myoHistory.gyroscope = myoHistory.gyroscope.slice(1);

	//console.log(data.orientation.z);



	if(Myo.armIsBusy){
		$('#busy').html('BUSY');
	}else{
		$('#busy').html('----');
	}

	update();
});

var getData = function(measurement){

	var result = {};
	_.each(measurement, function(data, index){
		_.each(data, function(val, axis){
			result[axis] = result[axis] || {label : axis, data : []};
			result[axis].data.push([val, index])
		});
	});
	return _.values(result);
}

var hasFist = false;

Myo.on('fist', function(edge){
	hasFist = edge;
})



var plots = {
	gyroscope : $.plot("#gyroscope", getData(myoHistory.gyroscope), {
		series: {shadowSize: 0},
		colors: [ '#84FFF1', '#FFF38A', '#FF4B23', '#00797F'],
		xaxis: {
			min : -400,
			max : 400
		},
		yaxis : {
			show: false,
			min : 0,
			max : myoHistory_size
		},
		legend : {
			backgroundOpacity : 0,
		},
		grid : {
			borderColor : "#427F78"
		}
	}),

	accelerometer : $.plot("#accelerometer", getData(myoHistory.accelerometer), {
		series: {shadowSize: 0},
		colors: [ '#84FFF1', '#FFF38A', '#FF4B23', '#00797F'],
		xaxis: {
			min : -2.5,
			max : 2.5
		},
		yaxis : {
			show: false,
			min : 0,
			max : myoHistory_size
		},
		legend : {
			backgroundOpacity : 0,
		},
		grid : {
			borderColor : "#427F78"
		}
	}),
	orientation : $.plot("#orientation", getData(myoHistory.orientation), {
		series: {shadowSize: 0},
		colors: [ '#84FFF1', '#FFF38A', '#FF4B23', '#00797F'],
		xaxis: {
			min : -1,
			max : 1
		},
		yaxis : {
			show: false,
			min : 0,
			max : myoHistory_size
		},
		legend : {
			backgroundOpacity : 0,
		},
		grid : {
			borderColor : "#427F78"
		}
	}),
}

var update = _.throttle(function(){
	_.each(plots, function(plot, type){
		data = getData(myoHistory[type])
		plot.setData(data);
		plot.draw();
	});

}, 20);


Myo.on('arm_recognized', function(){
	console.log('arm back', Myo.x_direction);
})


Myo.on('bluetooth_strength', function(val){
	if(this.id != myoId) return;
	$('#ble').html(val);
});



var poseHold;
Myo.on('pose', function(pose, edge){
	if(this.id != myoId) return;
	if(pose == 'rest') return;
	var imageName = 'img/' + (edge ? 'solid_blue_RH_' : 'blue_outline_RH_') + pose + '.png'
	$('#pose_image').attr('src', imageName);
});

Myo.on('position', function(x, y, theta){
	if(this.id != myoId) return;

	$('#pan_y').height( (y + 0.5)*100 + '%');
	$('#pan_x').width( (x + 0.5)*100 + '%');

	$('#roll_bar').css({
		'-webkit-transform' : 'rotate(' + theta + 'deg)'
	});

	$('#x').html(x.toFixed(2))
	$('#y').html(y.toFixed(2))
	$('#theta').html(theta.toFixed(2))
})


Myo.on('unlock', function(){
	this.vibrate('short').vibrate('short');
	console.log('unlocked');
})

Myo.on('lock', function(){
	this.vibrate('medium');
	console.log('locked');
})


Myo.on('double_tap', function(){
	if(this.id != myoId) return;
	this.zeroOrientation();
	if(this.isLocked){
		this.unlock()
	}else{
		this.lock();
	}
})

Myo.on('*', function(event){
	if(this.id != myoId) return;
	if(!_.contains(['imu', 'orientation', 'accelerometer', 'gyroscope', 'position', 'pose', 'rest'], event)){
		$('#events').html(event + '<br>' + $('#events').html());
	}
})



var myo0 = Myo.create(0);
var myo1 = Myo.create(1);
var myo2 = Myo.create(2);
var myo3 = Myo.create(3);
