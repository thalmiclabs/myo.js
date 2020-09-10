/**
 * Copyright 2015 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

//This tells Myo.js to create the web sockets needed to communnicate with Myo Connect


Myo.on('connected', function(){
	console.log('connected');
	this.streamEMG(true);

	setInterval(function(){
		updateGraph(rawData);
	}, 25)
})

Myo.connect('com.myojs.emgGraphs');


var rawData = [0,0,0,0,0,0,0,0];
Myo.on('emg', function(data){
	rawData = data;
})


var range = 150;
var resolution = 50;
var emgGraphs;

var graphData= [
	Array.apply(null, Array(resolution)).map(Number.prototype.valueOf,0),
	Array.apply(null, Array(resolution)).map(Number.prototype.valueOf,0),
	Array.apply(null, Array(resolution)).map(Number.prototype.valueOf,0),
	Array.apply(null, Array(resolution)).map(Number.prototype.valueOf,0),
	Array.apply(null, Array(resolution)).map(Number.prototype.valueOf,0),
	Array.apply(null, Array(resolution)).map(Number.prototype.valueOf,0),
	Array.apply(null, Array(resolution)).map(Number.prototype.valueOf,0),
	Array.apply(null, Array(resolution)).map(Number.prototype.valueOf,0)
]

$(document).ready(function(){

	emgGraphs = graphData.map(function(podData, podIndex){
		return $('#pod' + podIndex).plot(formatFlotData(podData), {
			colors: ['#8aceb5'],
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


});

var formatFlotData = function(data){
		return [data.map(function(val, index){
				return [index, val]
			})]
}


var updateGraph = function(emgData){

	graphData.map(function(data, index){
		graphData[index] = graphData[index].slice(1);
		graphData[index].push(emgData[index]);

		emgGraphs[index].setData(formatFlotData(graphData[index]));
		emgGraphs[index].draw();


	})

}




/*




*/