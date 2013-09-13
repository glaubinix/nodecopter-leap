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

var frameCounter = 0;
controller.on("frame", function(frame) {
	if (!inflight) {
		return;
	}

	frameCounter++;
	if (frameCounter % 6 !== 0) {
		return;
	}

	var event = false;
	if (frame.hands.length == 1) {
		var right_left_speed = frame.hands[0].palmNormal[0];
		if (right_left_speed > 0.2) {
			eventemitter.emit('left', right_left_speed);
			event = true;
		} else if (right_left_speed < -0.2) {
			eventemitter.emit('right', -1 * right_left_speed);
			event = true;
		}

		var forward_backward_speed = frame.hands[0].palmNormal[2];
		if (forward_backward_speed > 0.2) {
			eventemitter.emit('forward', forward_backward_speed);
			event = true;
		} else if (forward_backward_speed < -0.2) {
			eventemitter.emit('backward', -1 * forward_backward_speed);
			event = true;
		}

		if (!event) {
			//eventemitter.emit('stop', 'stop');
		}
	} else if (frame.hands.length == 2) {
		inflight = false;
		eventemitter.emit('land', "landing");
	}
});

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
