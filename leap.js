var Leap = require('leapjs'),
	_ = require('underscore');

var controller = new Leap.Controller({ inNode: true });

var eventemitter;
var drone_state = 'none';

var leap = function(emitter) {
	eventemitter = emitter;

	eventemitter.on('state', function(state) {
		drone_state = state;
	});
};

controller.on("frame", function(frame) {
	if (frame.id % 2 == 0) return;

	if (drone_state === 'landed' && frame.hands.length == 2) {
		//eventemitter.emit('takeoff');
		console.log("hand in -> takeoff");
	}

	if (drone_state !== 'inflight') {
		return;
	}

	if (frame.hands.length == 1) {
		if (frame.pointables.length === 0) {
			eventemitter.emit('land');
		}

		if (frame.pointables.length > 4) {
			// lets try to detect the big finger
			var x_direction = 0;
			_.each(frame.pointables, function (finger) {
				x_direction += finger.direction[0];
			});

			x_direction = x_direction / 5;
			var away = 0;
			var the_finger;
			_.each(frame.pointables, function (finger) {
				if (away < Math.abs(finger.direction[0] - x_direction)) {
					the_finger = finger;
				}
			});

			if (the_finger.tipVelocity[1] < -500 || the_finger.tipVelocity[1] > 900) {
				if (drone_state == 'inflight') {
					drone_state = 'trick';
					eventemitter.emit('flip');
					return;
				}
			}
		}

		var up_down_speed = frame.hands[0].palmVelocity[1];
		if (up_down_speed > 20) {
			eventemitter.emit('up', up_down_speed);
		} else if (up_down_speed < -20) {
			eventemitter.emit('down', -1 * up_down_speed);
		}

		var right_left_speed = frame.hands[0].palmNormal[0];
		if (right_left_speed > 0.15) {
			eventemitter.emit('left', right_left_speed);
		} else if (right_left_speed < -0.15) {
			eventemitter.emit('right', -1 * right_left_speed);
		}

		var forward_backward_speed = frame.hands[0].palmNormal[2];
		if (forward_backward_speed > 0.15) {
			eventemitter.emit('forward', forward_backward_speed);
		} else if (forward_backward_speed < -0.15) {
			eventemitter.emit('backward', -1 * forward_backward_speed);
		}

		eventemitter.emit('altitude', frame.hands[0].palmPosition[1]);

	} else if (frame.hands.length == 2) {
		eventemitter.emit('land');
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
