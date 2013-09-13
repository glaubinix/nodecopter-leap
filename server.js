/**
 * Created by ole on 9/13/13.
 */

var ee = require('eventemitter2');
var leapcontrol = require('./leap.js');
var drone = require('./drone.js');

var leap = new Leap(ee);
var drone = new Drone(ee);
