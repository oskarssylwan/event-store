require('dotenv').config()

const PORT                    = process.env.PORT

const server                  = require('express')();
const morgan                  = require('morgan');
const bodyParser              = require('body-parser');
const { createEventStore }    = require('./eventStore');
const { User }                = require('./user');
const { save, load }          = require('./mongo');

const aggregates              = [User];
const eventStoreDependencies  = { aggregates, save };
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

server.listen(PORT, () => { console.log('Server listening on port ', PORT)});
