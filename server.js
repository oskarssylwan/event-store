require('dotenv').config()

const HTTP_PORT                   = process.env.HTTP_PORT
const TCP_PORT                    = process.env.TCP_PORT
const MONGO_ADRESS                = process.env.MONGO_ADRESS;
const MONGO_NAME                  = process.env.MONGO_NAME;
const MONGO_COLLECTION            = process.env.MONGO_COLLECTION;

const net                         = require('net');
const bodyParser                  = require('body-parser');
const mongoClient                 = require('mongodb').MongoClient;
const express                     = require('express')();
const morgan                      = require('morgan');
const { User }                    = require('./user');
const { createEventStore }        = require('./eventStore');
const { createMongoIntegration }  = require('./mongo');
const { createPublisher }         = require('./publisher');

const toJson                      = JSON.stringify;
const onConnect                   = () => load().then(toJson);
const mongoDependencies           = { url: MONGO_ADRESS, name: MONGO_NAME, collection: MONGO_COLLECTION, mongo: mongoClient }
const { save, load }              = createMongoIntegration(mongoDependencies);
const publisherDependencies       = { port: TCP_PORT, onConnect, net }
const { broadcast }               = createPublisher(publisherDependencies);
const aggregates                  = [User];
const eventStoreDependencies      = { aggregates, save, broadcast };
const eventStore                  = createEventStore(eventStoreDependencies);

express.use(morgan('dev'));
express.use(bodyParser.json({}));
express.use(bodyParser.urlencoded({extended: false}));

express.post('/', (req, res) =>
  eventStore.processCommand(req.body)
  .then(x => res.send(x))
  .catch(x => res.send(x))
);

express.get('/:id', (req, res) =>
  load(req.params.id)
  .then(x => res.json(x))
  .catch(x => res.send(x))
)

express.listen(HTTP_PORT, () => { console.log('Reciever listening on port ', HTTP_PORT)});
