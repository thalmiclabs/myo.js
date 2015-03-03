
var quatInverse = function(q) {
	var len = Math.sqrt(q.x * q.x + q.y * q.y + q.z * q.z + q.w * q.w)
	return {
		w: q.w/len,
		x: -q.x/len,
		y: -q.y/len,
		z: -q.z/len
	};
};
var quatRotate = function(q, r) {
	return {
		w: q.w * r.w - q.x * r.x - q.y * r.y - q.z * r.z,
		x: q.w * r.x + q.x * r.w + q.y * r.z - q.z * r.y,
		y: q.w * r.y - q.x * r.z + q.y * r.w + q.z * r.x,
		z: q.w * r.z + q.x * r.y - q.y * r.x + q.z * r.w
	};
};

var H = quatRotate;


Myo.on('orientation', function(q){


	var origin = {x:0,y:0,z:1, w:0};


	var temp = H(H(q, origin), quatInverse(q));

	this.trigger('test', temp);





});


var hp