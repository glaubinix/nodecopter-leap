class Drone
  constructor: (@eventemitter, @client) ->

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

  sanatizeSpeed: (speed) ->
    Math.min(speed/1000, 1)

module.exports = Drone
