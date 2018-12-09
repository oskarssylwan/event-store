const { createMongoIntegration } = require('./index')

const { saveEvents, loadEvents } = createMongoIntegration({
  url: 'mongodb://localhost:27017/dev-store',
  name: 'mongo-playground',
  collection: 'events'
})

saveEvents([ { aggregateId: 123 } ])
  .fork(console.log, console.log)

loadEvents(123)
  .fork(console.log, console.log)
