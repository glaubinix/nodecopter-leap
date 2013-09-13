_ = require('underscore')

class Drone
  constructor: (@eventemitter, @client) ->
    @client.up = _.throttle(@client.up, 100)
    @client.down = _.throttle(@client.down, 100)

  start: ->
    @registerTakeoffAndLanding()
    @registerMoves()

  registerTakeoffAndLanding: ->
    @eventemitter.on 'takeoff', =>
      @client.takeoff => @eventemitter.emit 'inflight'
    @eventemitter.on 'land', =>
      @client.land => @eventemitter.emit 'ready'

  registerMoves: ->
    @eventemitter.on 'up', (speed) => @client.up @sanatizeSpeed speed
    @eventemitter.on 'down', (speed) => @client.down @sanatizeSpeed speed
    @eventemitter.on 'left', (speed) => @client.left speed
    @eventemitter.on 'right', (speed) => @client.right speed

  sanatizeSpeed: (speed) ->
    speed = Math.min(speed/400, 1)
    console.log speed
    speed

  land: () ->
    @client.land => @eventemitter.emit 'ready'

module.exports = Drone
