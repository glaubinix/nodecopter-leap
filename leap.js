var Leap = require('leapjs');

var controller = new Leap.Controller({ inNode: true });

var eventemitter;

var leap = function(emitter) {
	eventemitter = emitter;
}


controller.on("frame", function(frame) {
});

var frameCount = 0;
controller.on("frame", function(frame) {
	frameCount++;
});

setInterval(function() {
	var time = frameCount/2;
	console.log("received " + frameCount + " frames @ " + time + "fps");
	frameCount = 0;
}, 2000);

controller.on('ready', function() {
	console.log("ready");
});
controller.on('connect', function() {
	console.log("connect");
});

controller.on('disconnect', function() {
	console.log("disconnect -> land");
	eventemitter.emit('land');
});
controller.on('focus', function() {
	console.log("focus -> takeoff");
	eventemitter.emit('takeoff');
});
controller.on('blur', function() {
	console.log("blur");
});
controller.on('deviceConnected', function() {
	console.log("deviceConnected");
	eventemitter.emit('takeoff');
});
controller.on('deviceDisconnected', function() {
	console.log("deviceDisconnected -> land");
	eventemitter.emit('land');
});

controller.connect();

module.exports = leap;
