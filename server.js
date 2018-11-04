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

const aggregates              = [User];
const eventStoreDependencies  = { aggregates, save };
const eventStore              = createEventStore(eventStoreDependencies);
eventStore.on('newEvents', x => console.log('new Events', JSON.stringify(x, null, 2)));

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

server.listen(HTTP_PORT, () => { console.log('Server listening on port ', HTTP_PORT)});

// tcp

const connectionListener = connection => {
  connection.on('connect', x => console.log('Hello'));

  eventStore.on('newEvents', x => connection.write(JSON.stringify(x)));

  load()
  .then( x => JSON.stringify(x))
  .then(x => connection.write(x))
  .catch(x = connection.write('Cannot load events'))

}

const publisher = net.createServer(connectionListener)
publisher.on('data', x => console.log('hello'));
publisher.listen(TCP_PORT);
