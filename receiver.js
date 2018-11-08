const { pipe } = require('ramda');

const REQUEST = 'REQUEST';
const RESPONSE = 'RESPONSE';

const logStart = port => {
  console.log('Reciever listening on port ', port)
}

const use = middleware => express => {
  express.use(middleware)
  return express
}

const onPost = fn => path => express => {
  express.post(path, fn)
  return express
}

const handleRequest = emitter => (req, res) => {
  emitter.on(RESPONSE, x => res.send(x))
  emitter.emit(REQUEST, req.body)
}

const listen = port => express => {
  express.listen(port, () => log(port))
}

const createReceiver = ({ port, express, middleware }) => emitter => {

  pipe(
    use(middleware),
    onPost(handleRequest(emitter))('/'),
    listen(port)
  )(express)

  return emitter;
}




module.exports = { createReceiver, REQUEST, RESPONSE }
