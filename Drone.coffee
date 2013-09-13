_ = require('underscore')

between = (x, min, max) ->
  x >= min && x <= max

# between(x, 0.001, 0.009)

class Drone

  state = 'landed'
  drone_alt = 0 # 0 - 5000

  constructor: (@eventemitter, @client) ->
    @client.on 'navdata', (data) ->
      if data.demo?.batteryPercentage < 20
        console.warn "WARNING: BATTERY #{data.demo.batteryPercentage} CHARGED!"
      return unless state is 'inflight'
      drone_alt = data.demo.altitude * 1000
      #console.log 'drone alt: ', drone_alt

  start: ->
    @registerTakeoffAndLanding()
    @registerMoves()
    @registerTricks()

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
    @eventemitter.on 'left', (speed) => @client.left speed
    @eventemitter.on 'right', (speed) => @client.right speed
    @eventemitter.on 'forward', (speed) => @client.front speed
    @eventemitter.on 'backward', (speed) => @client.back speed

    @eventemitter.on 'altitude', (alt) => #0 - 400
      drone_perc = Math.round ((100/5000) * drone_alt)
      hand_perc = Math.round ((100/400) * alt)
      @altitudeMove(drone_perc, hand_perc)

  registerTricks: ->
    time = 1500
    @eventemitter.on 'flip', =>
      @updateState 'trick'
      setTimeout =>
        @updateState 'inflight'
      , time
      @client.animate 'flipAhead', time

  updateState: (new_state) =>
    state = new_state
    @eventemitter.emit 'state', state

  altitudeMove: (drone_perc_alt, hand_perc_alt) =>
    console.log "Drone alt: #{drone_perc_alt}%"
    console.log "Hand alt: #{hand_perc_alt}%"
    if between(drone_perc_alt, hand_perc_alt-5, hand_perc_alt+5)
      return
    if drone_perc_alt < hand_perc_alt
      @client.up 0.5
    if drone_perc_alt > hand_perc_alt
      @client.down 0.5

module.exports = Drone
