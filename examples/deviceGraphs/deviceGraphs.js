//This tells Myo.js to create the web sockets needed to communnicate with Myo Connect
Myo.connect();


Myo.on('orientation', function(quant){
	//updateGraph(quant);
})

Myo.on('gyroscope', function(quant){
	updateGraph(quant);
})


var range = 500;
var resolution = 100;
var graph;

var graphData= {
	x : Array.apply(null, Array(resolution)).map(Number.prototype.valueOf,0),
	y : Array.apply(null, Array(resolution)).map(Number.prototype.valueOf,0),
	z : Array.apply(null, Array(resolution)).map(Number.prototype.valueOf,0),
//	w : Array.apply(null, Array(resolution)).map(Number.prototype.valueOf,0)
}

var initialData = [];
for(var i; i< resolution; i++){
	initialData.push(0)
}
var graphData= {
	x : initialData.slice(0),
	y : initialData.slice(0),
	z : initialData.slice(0),
	w : nitialData.slice(0),
}


$(document).ready(function(){

	graph = $('.orientationGraph').plot(formatFlotData(), {
		colors: [ '#04fbec', '#ebf1be', '#c14b2a', '#8aceb5'],
		xaxis: {
			show: false,
			min : 0,
			max : resolution
		},
		yaxis : {
			min : -range,
			max : range,
		},
		grid : {
			borderColor : "#427F78",
			borderWidth : 1
		}
	}).data("plot");


});

var formatFlotData = function(){
	return Object.keys(graphData).map(function(axis){
		return {
			label : axis + ' axis',
			data : graphData[axis].map(function(val, index){
				return [index, val]
			})
		}
	});
}


var updateGraph = function(orientationData){
	Object.keys(orientationData).map(function(axis){
		graphData[axis] = graphData[axis].slice(1);
		graphData[axis].push(orientationData[axis]);
	});

	graph.setData(formatFlotData());
	graph.draw();
}


/*




*/