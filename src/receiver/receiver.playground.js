const { createReceiver } = require('./index')
const recevier = createReceiver({ port: 3000})([])

recevier
  .on('GET', '/')
  .pipe(_ => 'hello worlds!')
  .send()
