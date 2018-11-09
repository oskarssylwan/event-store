const EventEmitter = require('events');
const emitter = new EventEmitter();

emitter.on('hej', () => console.log('hello from tet emitter'));

emitter.emit('hej');
