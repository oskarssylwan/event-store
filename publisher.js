const createConnectionListener = ({ clients, onConnect }) => socket => {
  clients.push(socket);

  onConnect && onConnect()
    .then( x => socket.write(x))
    .catch( x => console.log(x))
}

const createBroadcast = clients => data => { clients.forEach(c => c.write(data)) }

const createPublisher = ({ net, port, onConnect, initialize = true }) => {

  const clients             = [];
  const broadcast           = createBroadcast(clients);
  const connectionListener  = createConnectionListener({ clients, onConnect });
  const server              = net.createServer(connectionListener);
  const start               = () => server.listen(port);

  server.on('listening', () => console.log('Publisher listening on port ', port))

  if (initialize) start();

  return { start, broadcast }

}

module.exports = { createPublisher }
