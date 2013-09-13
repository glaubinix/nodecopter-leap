// Generated by CoffeeScript 1.6.3
(function() {
  var Drone;

  Drone = (function() {
    function Drone(eventemitter, client) {
      this.eventemitter = eventemitter;
      this.client = client;
    }

    Drone.prototype.start = function() {
      registerTakeoffAndLanding();
      return registerMoves();
    };

    Drone.prototype.registerTakeoffAndLanding = function() {
      var _this = this;
      this.eventemitter.on('takeoff', function() {
        return _this.client.takeoff(function() {
          return _this.eventemitter.emit('inflight');
        });
      });
      return this.eventemitter.on('land', function() {
        return _this.client.land(function() {
          return _this.eventemitter.emit('ready');
        });
      });
    };

    Drone.prototype.registerMoves = function() {
      var _this = this;
      this.eventemitter.on('up', function(speed) {
        return _this.client.up(speed);
      });
      return this.eventemitter.down('up', function(speed) {
        return _this.client.down(speed);
      });
    };

    return Drone;

  })();

  module.exports = Drone;

}).call(this);