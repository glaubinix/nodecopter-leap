_ = require('underscore')

class Drone

  state = 'landed'
  alt = 0

  constructor: (@eventemitter, @client) ->
    @client.on 'navdata', (data) ->
      alt = data.demo.altitude
      console.log 'alt', alt

  start: ->
    @registerTakeoffAndLanding()
    @registerMoves()

  registerTakeoffAndLanding: ->
    @eventemitter.on 'takeoff', =>
      @client.takeoff =>
        updateState 'inflight'
    @eventemitter.on 'land', =>
      updateState 'landing'
      @client.land =>
        updateState 'landed'

  registerMoves: ->
    @eventemitter.on 'left', (speed) => sendCommand 'left', speed
    @eventemitter.on 'right', (speed) => sendCommand 'right', speed
    @eventemitter.on 'forward', (speed) => sendCommand 'front', speed
    @eventemitter.on 'backward', (speed) => sendCommand 'back', speed

    @eventemitter.on 'altitude', (alt) => #0 - 400
      #console.log 'send.alt', alt

  sendCommand: (cmd, arg) ->
    return unless state == 'inflight'
    @client[cmd](arg)

  updateState: (new_state) =>
    state = new_state
    @eventemitter.emit state

module.exports = Drone
