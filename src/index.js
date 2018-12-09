const morgan = require('morgan')
const bodyParser = require('body-parser')
const { createMongoIntegration } = require('./mongo/index')
const { createReceiver } = require('./receiver/index')
const { Either } = require('monet')
const middleware = [morgan('dev'), bodyParser.json({}), bodyParser.urlencoded({ extended: false })]
const { find, propEq, pipe, reduce } = require('ramda')
const { eitherToFuture } = require('./utility/index')
const Future = require('fluture')

const toAggregateReq = req => Either.of({
  type: req.params.aggregateType,
  id: req.params.aggregateId,
  newEvents: req.body,
  oldEvents: []
})

const addAggregateIdentifiersToEvents = aggregateReq =>
({
  ...aggregateReq,
  newEvents: aggregateReq.newEvents.map(event => ({
    ...event,
    aggregateId: aggregateReq.id,
    aggregateType: aggregateReq.type
  }))
})

const createEventStore = config => aggregates => {

  const receiver = createReceiver({
    port: config.httpPort
  })(middleware)

  const { saveEvents, loadEvents } = createMongoIntegration({
    url: config.mongoAdress,
    name: config.mongoName,
    collection: config.mongoCollection
  })

  const addOldEvents = aggregateReq =>
    loadEvents(aggregateReq.id)
      .map(oldEvents => ({ ...aggregateReq, oldEvents }))

  const saveNewEvents = aggregateReq =>
    saveEvents(aggregateReq.newEvents)
      .map( _ => aggregateReq)

  const createAggregateRoot = aggregates => aggregateReq =>
  {
    const schema = find(propEq('type', 'USER'), aggregates)
    return schema
      ? Either.Right({ ...aggregateReq, ...schema })
      : Either.Left(`Stream of type ${aggregateReq.type} could not be found`)
  }

  const playEvents = aggregateRoot =>
  {
    const oldEvents = aggregateRoot.oldEvents || []
    const newEvents = aggregateRoot.newEvents['includes']
    ?  aggregateRoot.newEvents : []
    const events = [ ...oldEvents, ...newEvents ]
    return reduce(aggregateRoot.reducer, {}, events)
  }


  const validateAggregateState = aggregateRoot =>
  {
    const state = playEvents(aggregateRoot)
    const validate = (error, fn) => {
      if (!!error) return error
      return fn(state)
    }
    const errors = reduce(validate, null, aggregateRoot.boundaries)

    return errors
      ? Either.Left(errors)
      : Either.Right(aggregateRoot)
  }


  const handleStreamReq = req =>
    toAggregateReq(req)
      .map(addAggregateIdentifiersToEvents)
      .chain(pipe(createAggregateRoot(aggregates), eitherToFuture))
      .chain(addOldEvents)
      .chain(pipe(validateAggregateState, eitherToFuture))
      .chain(saveNewEvents)
      .map(x => {console.log('vad', x); return x})

  const handleProjectionReq = req =>
    toAggregateReq(req)
      .chain(createAggregateRoot(aggregates))
      .chain(addOldEvents)
      .map(x => {console.log('vad', x); return x})
      .map(playEvents)


  receiver
    .on('POST', '/stream/:aggregateType/:aggregateId')
    .pipe(handleStreamReq)
    .send()

  receiver
    .on('GET', '/projection/:aggregateType/:aggregateId')
    .pipe(handleProjectionReq)
    .send()

}

module.exports = { createEventStore }
