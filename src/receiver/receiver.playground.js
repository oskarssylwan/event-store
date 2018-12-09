const { createReceiver } = require('./index')
const Future = require('fluture')

const recevier = createReceiver({ port: 3000})([])

recevier
  .on('GET', '/')
  .pipe(_ => Future.of('Hola amigos!'))
  .send()
