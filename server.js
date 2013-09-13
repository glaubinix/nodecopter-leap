/**
 * Created by ole on 9/13/13.
 */

var EventEmitter2 = require('eventemitter2').EventEmitter2;
var leapcontrol = require('./leap.js');
var arDrone = require('ar-drone');
var client  = arDrone.createClient();
var Drone = require('./Drone.js');

var ee = new EventEmitter2({
	wildcard: true,
	delimiter: '::',
	maxListeners: 20
});

var leap = new leapcontrol(ee);
var drone = new Drone(ee, client);
drone.start();

process.on('SIGINT', function() {
    console.log('bye bye');
    drone.land(function(){
        process.exit();
    });
    setTimeout(function(){
        process.exit();
    }, 2)
});
