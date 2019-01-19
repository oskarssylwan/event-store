const { createEventStore } = require('../src/index')
const { User } = require('./user')
const { filter, tap } = require('rxjs/operators')

const config = {
  httpPort: 3000,
  tcpPort: 3001,
  mongoAdress: 'mongodb://localhost:27017/dev-store',
  mongoName: 'dev-store',
  mongoCollection: 'events',
}

const eventStore = createEventStore(config)([ User ])

eventStore.pipe(
  filter(event => event.type === 'USER_CREATED'),
  tap(console.log)
).subscribe()
