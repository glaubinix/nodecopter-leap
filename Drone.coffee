_ = require('underscore')

class Drone
  constructor: (@eventemitter, @client) ->

  start: ->
    @registerTakeoffAndLanding()
    @registerMoves()

  registerTakeoffAndLanding: ->
    @eventemitter.on 'takeoff', =>
      @client.takeoff =>
        @eventemitter.emit 'inflight'
    @eventemitter.on 'land', =>
      @client.land => @eventemitter.emit 'ready'

  registerMoves: ->
    @eventemitter.on 'left', (speed) => @client.left speed
    @eventemitter.on 'right', (speed) => @client.right speed
    @eventemitter.on 'forward', (speed) => @client.front speed
    @eventemitter.on 'backward', (speed) => @client.back speed

  land: () ->
    @client.land => @eventemitter.emit 'ready'

module.exports = Drone
