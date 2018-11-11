const { pipe } = require('ramda')

const REQUEST = 'REQUEST'
const RESPONSE = 'RESPONSE'
const LOG = 'LOG'
const ERROR = 'ERROR'

const use = middleware => express => {
  express.use(middleware)
  return express
}

const onPost = fn => path => express => {
  express.post(path, fn)
  return express
}

const handleRequest = emitter => (req, res) => {
  let sent = false;

  const send = response => {
    res.send(response)
    sent = true
  }

  setTimeout(() => { !sent && send('Processing commands') }, 5000)
  emitter.once(RESPONSE, () => { send('Success') })
  emitter.once(ERROR, x => { send(x) })
  emitter.emit(REQUEST, req.body)
}

const listen = port => emitter => express => {
  express.listen(port, () => emitter.emit(LOG, `Receiver listening on port ${port}`))
}

const createReceiver = ({ port, express, middleware }) => emitter => {

  pipe(
    use(middleware),
    onPost(handleRequest(emitter))('/'),
    listen(port)(emitter)
  )(express)

  return emitter;
}




module.exports = { createReceiver, REQUEST, RESPONSE }
