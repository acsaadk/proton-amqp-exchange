'use strict'

require('dotenv').config()

const amqp = require('amqplib')
const AMQPExchangeTest = require('./AMQPExchangeTest.js')
const supertest = require('co-supertest')

describe('proton-amqp-exchange class test', () => {
  it('should create an exchange with the name of the class', function*() {
    const conn = yield amqp.connect(AMQPExchangeTest.url, AMQPExchangeTest.socketOptions)
    yield AMQPExchangeTest.beforeCreateChannel(conn)
    const ch = yield conn.createChannel()
    yield ch.assertExchange('AMQPExchangeTest', AMQPExchangeTest.type, AMQPExchangeTest.options)
    const exchange = new AMQPExchangeTest(ch, 'AMQPExchangeTest')
    yield exchange.destroy()
    yield exchange.closeChannel()
    yield conn.close()
  })
})
