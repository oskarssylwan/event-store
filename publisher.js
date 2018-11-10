
const PUBLISH = 'publish';

const createConnectionListener = ({ clients, onConnect }) => socket => {
  clients.push(socket)

  onConnect && onConnect()
    .then( x => socket.write(x))
    .catch( x => console.log(x))
}

const createBroadcast = clients => data => { clients.forEach(c => c.write(data)) }

const createPublisher = ({ net, port, onConnect }) => emitter => {

  const clients             = []
  const broadcast           = createBroadcast(clients)
  const connectionListener  = createConnectionListener({ clients, onConnect })
  const server              = net.createServer(connectionListener)

  server.listen(port)
  server.on('listening', () => console.log('Publisher listening on port ', port))

  emitter.on(PUBLISH, broadcast)

  return emitter

}

module.exports = { createPublisher, PUBLISH }
