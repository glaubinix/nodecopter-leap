var Leap = require('leapjs');

var controller = new Leap.Controller({ inNode: true });

var client;
var inflight = false;
var drone_ready = true;

var leap = function(ardrone) {
	client = ardrone;
};

var frameCounter = 0;
controller.loop(function(frame) {
	if (!inflight) {
		//return;
	}

	frameCounter++;
	if (frameCounter % 6 !== 0) {
		return;
	}

	var event = false;
	if (frame.hands.length == 1) {

		var right_left_speed = frame.hands[0].palmNormal[0];
		if (right_left_speed > 0.15) {
			console.log('left', Math.abs(right_left_speed))
			event = true;
			client.left(Math.abs(right_left_speed));
		} else if (right_left_speed < -0.15) {
			console.log('right', Math.abs(right_left_speed));
			client.right('right', Math.abs(right_left_speed));
			event = true;
		}

		var forward_backward_speed = frame.hands[0].palmNormal[2];
		if (forward_backward_speed > 0.15) {
			client.front(Math.abs(forward_backward_speed));
			console.log('front', Math.abs(forward_backward_speed))
			event = true;
		} else if (forward_backward_speed < -0.15) {
			console.log('back', Math.abs(forward_backward_speed));
			client.back('back', Math.abs(forward_backward_speed));
			event = true;
		}

		if (!event) {
			//client.stop();
		}
	} else if (frame.hands.length == 2) {
		inflight = false;
		client.land();
		console.log('land')
	}
});

controller.on('disconnect', function() {
	console.log("disconnect -> land");
	client.land();
	inflight = false;
});
controller.on('focus', function() {
	if (drone_ready) {
		console.log("focus -> takeoff");
		client.takeoff(function() {
			inflight = true;
		})
	}
});

controller.on('deviceDisconnected', function() {
	console.log("deviceDisconnected -> land");
	inflight = false;
	client.land();
});

controller.connect();

module.exports = leap;
