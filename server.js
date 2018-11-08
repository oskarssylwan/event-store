require('dotenv').config()

const HTTP_PORT                   = process.env.HTTP_PORT
const TCP_PORT                    = process.env.TCP_PORT
const MONGO_ADRESS                = process.env.MONGO_ADRESS;
const MONGO_NAME                  = process.env.MONGO_NAME;
const MONGO_COLLECTION            = process.env.MONGO_COLLECTION;

const EventEmitter                = require('events');
const net                         = require('net');
const mongoClient                 = require('mongodb').MongoClient;
const { User }                    = require('./user');
const { createPublisher }         = require('./publisher');

const { createEventStore, PROCESS_COMMAND, COMMAND_PROCESSED } = require('./eventStore');
const { createMongoIntegration, SAVE, SAVED, RETRIEVE, RETRIEVED }  = require('./mongo');



const emitterStore                = new EventEmitter();
const emitterMongo                = new EventEmitter();
const toJson                      = JSON.stringify;
const mongoDependencies           = { url: MONGO_ADRESS, name: MONGO_NAME, collection: MONGO_COLLECTION, mongo: mongoClient }
// const onConnect                   = () => load().then(toJson);
// const publisherDependencies       = { port: TCP_PORT, onConnect, net }
const aggregates                  = [ User ];
// const { broadcast }               = createPublisher(publisherDependencies);


const mongoIntegration            = createMongoIntegration(mongoDependencies)(emitterMongo);
const eventStore                  = createEventStore({ aggregates })(emitterStore);

eventStore.on(COMMAND_PROCESSED, x => mongoIntegration.emit(SAVE, x))

express.use(morgan('dev'));
express.use(bodyParser.json({}));
express.use(bodyParser.urlencoded({extended: false}));

const express      = require('express')();
const morgan       = require('morgan');
const bodyParser   = require('body-parser');
