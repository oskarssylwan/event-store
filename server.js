require('dotenv').config()

const HTTP_PORT               = process.env.HTTP_PORT
const TCP_PORT                = process.env.TCP_PORT

const server                  = require('express')();
const morgan                  = require('morgan');
const bodyParser              = require('body-parser');
const { createEventStore }    = require('./eventStore');
const { User }                = require('./user');
const { save, load }          = require('./mongo');
const net                     = require('net');
const { createPublisher }     = require('./publisher');

const toJson                  = JSON.stringify;
const onConnect               = () => load().then(toJson);
const publisherDependencies   = { port: TCP_PORT, onConnect }
const { broadcast }           = createPublisher(publisherDependencies);
const aggregates              = [User];
const eventStoreDependencies  = { aggregates, save, broadcast };
const eventStore              = createEventStore(eventStoreDependencies);

server.use(morgan('dev'));
server.use(bodyParser.json({}));
server.use(bodyParser.urlencoded({extended: false}));

server.post('/', (req, res) =>
  eventStore.processCommand(req.body)
  .then(x => res.send(x))
  .catch(x => res.send(x))
);

server.get('/:id', (req, res) =>
  load(req.params.id)
  .then(x => res.json(x))
  .catch(x => res.send(x))
)

server.listen(HTTP_PORT, () => { console.log('Reciever listening on port ', HTTP_PORT)});
