/**
 * Snap
 *
 * Requries lodash.js or underscore.js
 *
 */
var MAX_DIFF = 2.8;
var MIN_DIFF = 0.122070312;
var BLIP_THRESHOLD = -0.061035156 * 1.8;

var snapHistory = _.times(20, function(){ return {x:0,y:0,z:0}});

Myo.on('accelerometer', function(data){

	var ssc = {x:0,y:0,z:0};

	var max = _.clone(data);
	var min = _.clone(data);

	// update snapHistory
	snapHistory.push(data);
	snapHistory = snapHistory.slice(1);

	for(var i = 1; i < snapHistory.length -1; i++){
		var prev = snapHistory[i+1];
		var current = snapHistory[i];
		var next = snapHistory[i-1];

		_.each(['x', 'y', 'z'], function(axis){
			if((current[axis] - prev[axis]) * (next[axis] - current[axis]) < BLIP_THRESHOLD){
				ssc[axis]++;
			}
			if(current[axis] > max[axis]) max[axis] = current[axis];
			if(current[axis] < min[axis]) min[axis] = current[axis];
		});
	}

	var hasBlip = (ssc.x > 0 && ssc.y > 2) || (ssc.x+ssc.y+ssc.z > 4);

	//check diff Thresholds
	var peakedThresholds = _.all(['x', 'y', 'z'], function(axis){
		var peakDiff = max[axis] - min[axis];
		return peakDiff >= MIN_DIFF && peakDiff <= MAX_DIFF;
	});

	if(hasBlip && peakedThresholds){
		this.trigger('snap');
		snapHistory = _.times(20, function(){ return {x:0,y:0,z:0}});
	}
});