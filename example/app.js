const { createEventStore } = require('../src/index')
const { user } = require('./user')

const config = {
  httpPort: 3000,
  tcpPort: 3001,
  mongoAdress: 'mongodb://localhost:27017/dev-store',
  mongoName: 'dev-store',
  mongoCollection: 'events',
}

createEventStore(config)([ user ])
