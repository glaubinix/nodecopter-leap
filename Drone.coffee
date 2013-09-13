_ = require('underscore')

class Drone

  state = 'landed'
  drone_alt = 0 # 0 - 50000

  constructor: (@eventemitter, @client) ->
    @client.on 'navdata', (data) ->
      if data.demo.batteryPercentage < 20
        console.warn "WARNING: BATTERY #{data.demo.batteryPercentage} CHARGED!"
      return unless state is 'inflight'
      drone_alt = data.demo.altitude * 1000
      #console.log 'drone alt: ', drone_alt

  start: ->
    @registerTakeoffAndLanding()
    @registerMoves()

  registerTakeoffAndLanding: ->
    @eventemitter.on 'takeoff', =>
      @updateState 'starting'
      @client.takeoff =>
        @updateState 'inflight'
    @eventemitter.on 'land', =>
      @updateState 'landing'
      @client.land =>
        @updateState 'landed'

  registerMoves: ->
    ###
    @eventemitter.on 'left', (speed) => @sendCommand 'left', speed
    @eventemitter.on 'right', (speed) => @sendCommand 'right', speed
    @eventemitter.on 'forward', (speed) => @sendCommand 'front', speed
    @eventemitter.on 'backward', (speed) => @sendCommand 'back', speed
    ###

    @eventemitter.on 'left', (speed) => @client.left speed
    @eventemitter.on 'right', (speed) => @client.right speed
    @eventemitter.on 'forward', (speed) => @client.front speed
    @eventemitter.on 'backward', (speed) => @client.back speed

    @eventemitter.on 'altitude', (alt) => #0 - 400
      #drone_perc =
      #console.log 'send.alt', alt

  sendCommand: (cmd, arg) ->
    console.log 'this should never happen'
    return unless state is 'inflight'
    console.log cmd, arg
    @client[cmd](arg)

  updateState: (new_state) =>
    state = new_state
    @eventemitter.emit 'state', state

  calculate_drone_speed: (drone_perc_alt, hand_perc_alt) =>


module.exports = Drone
