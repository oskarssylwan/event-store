const net = require('net')
const { createPublisher } = require('./publisher')

module.exports = { createPublisher: createPublisher(net) }
