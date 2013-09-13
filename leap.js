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
		return;
	}

	var event = false;
	if (frame.hands.length > 0) {
		var up_down_speed = frame.hands[0].palmVelocity[1];
		if (up_down_speed > 20) {
			eventemitter.emit('up', up_down_speed);
			event = true;
		} else if (up_down_speed < -20) {
			eventemitter.emit('down', -1 * up_down_speed);
			event = true;
		}

		var right_left_speed = frame.hands[0].palmNormal[0];
		if (right_left_speed > 0.15) {
			eventemitter.emit('left', right_left_speed);
			event = true;
		} else if (right_left_speed < -0.15) {
			eventemitter.emit('right', -1 * right_left_speed);
			event = true;
		}

		var forward_backward_speed = frame.hands[0].palmNormal[2];
		if (forward_backward_speed > 0.15) {
			eventemitter.emit('forward', forward_backward_speed);
			event = true;
		} else if (forward_backward_speed < -0.15) {
			eventemitter.emit('backward', -1 * forward_backward_speed);
			event = true;
		}

		if (!event) {
			eventemitter.emit('stop');
		}
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
