var Leap = require('leapjs');

var controller = new Leap.Controller({ inNode: true });

var eventemitter;
var inflight = false;
var drone_ready = true;

var leap = function(emitter) {
	eventemitter = emitter;

	eventemitter.on('inflight', function() {
		inflight = true;
	});
};

controller.on("frame", function(frame) {
	if (!inflight) {
		//return;
	}

	if (frame.hands.length > 0) {
		var speed = frame.hands[0].palmVelocity[1];
		if (speed > 0) {
			eventemitter.emit('up', speed);
		} else if (speed < 0) {
			eventemitter.emit('down', -1 * speed);
		}
	}
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
	inflight = false;
});
controller.on('focus', function() {
	if (drone_ready) {
		console.log("focus -> takeoff");
		eventemitter.emit('takeoff');
	}
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
	inflight = false;
	eventemitter.emit('land');
});

controller.connect();

module.exports = leap;
