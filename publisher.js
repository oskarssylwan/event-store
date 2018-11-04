const net = require('net');

const createConnectionListener = ({ clients, onConnect }) => socket => {
  clients.push(socket);

  onConnect()
    .then( x => socket.write(x))
    .catch( x => console.log(x))
}

const broadcast = clients => data => { clients.forEach(c => c.write(data)) }

const createPublisher = ({ port, onConnect, initialize = true }) => {

  const clients             = [];
  const broadcast           = broadCast(clients);
  const connectionListener  = connectionListener({ clients, onConnect });
  const server              = net.createServer(connectionListener);
  const start               = () => server.listen(port);

  if (initialize) start();

  return { start, broadcast }

}

module.exports = { createPublisher }
