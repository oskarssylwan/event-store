const { createPublisher } = require('./index')

const { broadcast } = createPublisher({
  port: 3001,
  onConnect: () => {
    console.log('Client connected')
    broadcast('hello world')
    return Promise.resolve('hello')
  }
})
