/**
 * Created by ole on 9/13/13.
 */
var leapcontrol = require('./leap.js');
var arDrone = require('ar-drone');
var client  = arDrone.createClient();

var leap = new leapcontrol(client);
//var drone = new Drone(ee, client);
//drone.start();

process.on('SIGINT', function() {
    console.log('bye bye');
    client.land(function(){
        process.exit();
    });
    setTimeout(function(){
        process.exit();
    }, 2)
});
