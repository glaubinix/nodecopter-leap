class Drone
  constructor: (@eventemitter, @client) ->

  start: ->
    registerTakeoffAndLanding()
    registerMoves()

  registerTakeoffAndLanding: ->
    @eventemitter.on 'takeoff', =>
      @client.takeoff => @eventemitter.emit 'inflight'
    @eventemitter.on 'land', =>
      @client.land => @eventemitter.emit 'ready'

  registerMoves: ->
    @eventemitter.on 'up', (speed) => @client.up speed
    @eventemitter.down 'up', (speed) => @client.down speed

module.exports = Drone
