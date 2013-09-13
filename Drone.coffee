class Drone
  constructor: (@eventemitter, @client) ->
    @eventemitter.on 'takeoff', ->
      @client.takeoff -> @eventemitter.emit 'inflight'
    @eventemitter.on 'land', ->
      @client.land -> @eventemitter.emit 'ready'

module.export = Drone
