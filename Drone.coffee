_ = require('underscore')

class Drone
  constructor: (@eventemitter, @client) ->
    @client.up = _.throttle(@client.up, 10)
    @client.down = _.throttle(@client.down, 10)
    @client.on 'navdata', (data) ->
      console.log 'alt',data.droneState.demo.altitude
      console.log 'altmeter',data.droneState.demo.altitudeMeters

  start: ->
    @registerTakeoffAndLanding()
    @registerMoves()

  registerTakeoffAndLanding: ->
    @eventemitter.on 'takeoff', =>
      @client.takeoff =>
        @client.up 1
        setTimeout =>
          @client.stop()
          @eventemitter.emit 'inflight'
        , 2000
    @eventemitter.on 'land', =>
      @client.land => @eventemitter.emit 'ready'

  registerMoves: ->
    @eventemitter.on 'left', (speed) => @client.left speed
    @eventemitter.on 'right', (speed) => @client.right speed
    @eventemitter.on 'forward', (speed) => @client.front speed
    @eventemitter.on 'backward', (speed) => @client.back speed

    @eventemitter.on 'altitude', (alt) => #0 - 400
      #console.log 'send.alt', alt

  sanatizeSpeed: (speed) ->
    Math.min(speed/400, 1)

  land: () ->
    @client.land => @eventemitter.emit 'ready'

module.exports = Drone
