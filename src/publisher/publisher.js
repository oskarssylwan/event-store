
const createConnectionListener = ({ clients, onConnect }) => socket => {
  clients.push(socket)

  onConnect && onConnect()
    .then( x => socket.write(x))
    .catch(console.log)
}

const createBroadcast = clients => data => { clients.forEach(c => c.write(data)) }

const createPublisher = net => ({ port, onConnect }) => {

  const clients             = []
  const broadcast           = createBroadcast(clients)
  const connectionListener  = createConnectionListener({ clients, onConnect })
  const server              = net.createServer(connectionListener)

  server.listen(port)
  server.on('listening', () => console.log(`Publisher listening on port ${port}`))

  return { broadcast }
}

module.exports = { createPublisher }
