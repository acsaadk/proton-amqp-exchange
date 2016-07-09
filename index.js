'use strict'

module.exports = class AMQPExchange {

  constructor(channel, name) {
    this._channel = channel
    this._name = name
    const _this = this
    this._channel.on('close', () => _this.onClose())
    this._channel.on('error', err => _this.onError(err))
    this._channel.on('return', msg => _this.onReturn(msg))
    this._channel.on('drain', () => _this.onDrain())
  }

/**
  * @method url
  * @description This method must be overriden to specify the url connection
  * @throws Error by default if it's not implemented
  * @returns String containing the url of AMQP server
  * @author Antonio Saad
*/
  static get url() {
    throw new Error('You must implement the `static get url()` getter method, returning a string with the url to connect to AMQP server')
  }

/**
  * @method socketOptions
  * @description This method can be overriden to specify options for the socket connection.
  * For more info, check: http://www.squaremobius.net/amqp.node/channel_api.html#connect
  * @returns undefined by default, otherwise it must return a JSON with the options
  * @author Antonio Saad
*/
  static get socketOptions() {
    return undefined
  }

/**
  * @method type
  * @description This method must be overriden to specify a valid type of exchange (direct, fanout, topic)
  * @throws Error by default if it's not implemented
  * @returns String specifying a valid type of exchange
  * @author Antonio Saad
*/
  static get type() {
    throw new Error('You must implement the `static get type()` getter method, returning a valid type of exchange')
  }

/**
  * @method bindings
  * @description This method can be overriden to specify bindings to another exchanges or queues
  * @returns Array of JSON objects with the following structure:
  * [
  *   {
  *      routingKey: "routing key pattern"
  *      source: "exchange name which wants to join",
  *      args: { OPTIONAL },
  *      to: ['queue' | 'exchange']
  *   },
  *   ...
  * ]
  * @author Antonio Saad
*/
  get bindings() {
    return []
  }

/**
  * @method options
  * @description This method can be overriden to specify a JSON with options for creating the exchange.
  * For more info, check: http://www.squaremobius.net/amqp.node/channel_api.html#channel_assertExchange
  * @returns undefined by default, otherwise it must return a JSON
  * @author Antonio Saad
*/
  static get options() {
    return undefined
  }

/**
  * @method FANOUT
  * @description returns a valid type of exchange, it can be used as return value
  * when overriding `static get type()` method
  * @returns String 'fanout'
  * @author Antonio Saad
*/
  static get FANOUT() {
    return 'fanout'
  }

/**
  * @method DIRECT
  * @description returns a valid type of exchange, it can be used as return value
  * when overriding `static get type()` method
  * @returns String 'direct'
  * @author Antonio Saad
*/
  static get DIRECT() {
    return 'direct'
  }

/**
  * @method TOPIC
  * @description returns a valid type of exchange, it can be used as return value
  * when overriding `static get type()` method
  * @returns String 'topic'
  * @author Antonio Saad
*/
  static get TOPIC() {
    return 'topic'
  }

/**
  * @method channel
  * @description AMQP native channel
  * @returns Object to handle the underlying channel provided by the API.
  * For more info, check: http://www.squaremobius.net/amqp.node/channel_api.html#channel
  * @author Antonio Saad
*/
  get channel() {
    return this._channel
  }

/**
  * @method name
  * @description Exchange's name. It'll be the name of the child class
  * @returns string containing the exchange's name
  * @author Antonio Saad
*/
  get name() {
    return this._name
  }

/**
  * @method closeChannel
  * @description Closes the channel
  * @param cb Callback to execute after the channel is closed.
  * It has the following format: function(err) {...}
  * @returns Promise if no callback specified
  * @author Antonio Saad
*/
  closeChannel(cb) {
    return this._channel.close(cb)
  }

/**
  * @method destroy
  * @description Delete an exchange from the AMQP server
  * @param opts The only meaningful field is:
              - ifUnused (boolean): if true and the exchange has bindings,
                it will not be deleted and the channel will be closed.
  * @returns Promise
  * @author Antonio Saad
*/
  destroy(opts) {
    return this._channel.deleteExchange(this._name, opts)
  }

/**
  * @method unbindFrom
  * @description Remove a binding to another exchange
  * @param exchangeName String source exchange name
  * @param pattern String Routing key pattern
  * @param args Object arguments extension
  * @param cb Callback to execute after exchange binding has been removed
  * It has the following format: function(err, ok) {...}
  * @returns Promise if no cb specified
  * @author Antonio Saad
*/
  unbindFrom(exchangeName, pattern, args, cb) {
    return this._channel.unbindExchange(this._name, exchangeName, pattern, args, cb)
  }

/**
  * @method publish
  * @description Publish a message
  * @param content Buffer Message to publish
  * @param routingKey String Pattern to route the message to the appropiate queues
  * @param opts JSON special parameters.
  For more info, check: http://www.squaremobius.net/amqp.node/channel_api.html#channel_publish
  * @returns Promise
  * @author Antonio Saad
*/
  publish(content, routingKey, opts) {
    return this._channel.publish(this._name, routingKey, content, opts)
  }

/**
  * @method onClose
  * @description Invoked when channel has  been clossed
  * @author Antonio Saad
*/
  onClose() {

  }

/**
  * @method onError
  * @description Invoked when the server closes the channel for any reason
  * @param err Object containing the error
  * @author Antonio Saad
*/
  onError(err) {

  }

/**
  * @method onReturn
  * @description Invoked when the published message cannot be routed
  * @param msg Buffer the returned message
  * @author Antonio Saad
*/
  onReturn(msg) {

  }
/**
  * @method onDrain
  * @description Invoked once the write buffer has been emptied (i.e., once it is
  * ready for writes again)
  * @author Antonio Saad
  */
  onDrain() {

  }

/**
  * @method beforeCreateChannel
  * @description Invoked before creating the channel for this exchange
  * @param conn Object Connection to the AMQP server.
  * WARNING: This connection is the underlying socket shared between all the
  * created channels, so any change will affect all channels
  * @author Antonio Saad
*/
  static *beforeCreateChannel(conn) {

  }

}
