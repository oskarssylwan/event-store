require('dotenv').config()
const { pipe } = require('ramda')
const EventEmitter = require('events')
const net = require('net')
const { createEventStore, PROCESS_EVENTS, EVENTS_PROCESSED } = require('./core')
const { createMongoIntegration, SAVE, SAVED, RETRIEVE, RETRIEVED }  = require('./mongo')
const { createReceiver, REQUEST, RESPONSE } = require('./receiver')
const { createPublisher, PUBLISH } = require('./publisher')
const mongoClient = require('mongodb').MongoClient
const { User } = require('./example-aggregate')
const express = require('express')()
const morgan = require('morgan')
const bodyParser = require('body-parser')

const HTTP_PORT = process.env.HTTP_PORT
const TCP_PORT = process.env.TCP_PORT
const MONGO_ADRESS = process.env.MONGO_ADRESS
const MONGO_NAME = process.env.MONGO_NAME
const MONGO_COLLECTION = process.env.MONGO_COLLECTION

const ERROR = 'ERROR'
const LOG = 'LOG'

const aggregates = [ User ]
const middleware = [morgan('dev'), bodyParser.json({}), bodyParser.urlencoded({ extended: false })]
const mongoDependencies = { url: MONGO_ADRESS, name: MONGO_NAME, collection: MONGO_COLLECTION, mongo: mongoClient }
const publisherDependencies = { port: TCP_PORT, net }
const receiverDependencies = { express, middleware, port: HTTP_PORT }
const eventStoreDependencies = { aggregates }

const emitter = pipe(
  createReceiver(receiverDependencies),
  createEventStore(eventStoreDependencies),
  createMongoIntegration(mongoDependencies),
  createPublisher(publisherDependencies)
)(new EventEmitter())

const asJSON = JSON.stringify

emitter.on(REQUEST, x => emitter.emit(PROCESS_EVENTS, x))
emitter.on(EVENTS_PROCESSED, x => emitter.emit(SAVE, x))
emitter.on(SAVED, x => emitter.emit(LOG, `saved event ${asJSON(x)}`))
emitter.on(SAVED, x => emitter.emit(PUBLISH, asJSON(x)))
emitter.on(SAVED, x => emitter.emit(RESPONSE, x))
emitter.on(LOG, console.log)
emitter.on(ERROR, console.log)
