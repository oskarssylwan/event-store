const express = require('express')()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const { Either } = require('monet')
const { createMongoIntegration } = require('./mongo/index')
const middleware = [morgan('dev'), bodyParser.json({}), bodyParser.urlencoded({ extended: false })]

const toAggregateReq = req => Either.of({
  type: req.params.aggregateType,
  id: req.params.aggregateId,
  newEvents: req.body,
  oldEvents: []
})

const onSuccess = res => x => res.json(x)
const onFail = onSuccess
const addAggregateIdentifiersToEvents = aggregateReq =>
({
  ...aggregateReq,
  events: aggregateReq.events.map(event => ({
    ...event,
    aggregateId: aggregateReq.id,
    aggregateType: aggregateReq.type
  }))
})

const createEventStore = config => aggregates => {

  const { save, load } = createMongoIntegration({
    url: config.mongoAdress,
    name: config.mongoName,
    collection: config.mongoCollection
  })

  const addOldEvents = aggregateReq =>
    load(aggregateReq.id)
      .map(oldEvents => ({ ...aggregateReq, oldEvents }))


  const handleStreamReq = (req, res) =>
    toAggregateReq(req)
      .chain(addOldEvents)
      .map(validateAggregateState)
      .fork(onFail(res), onSuccess(res))

  express.use(middleware)
  express.post('/stream/:aggregateType/:aggregateId', handleStreamReq)

  express.listen(config.httpPort, () => console.log(`Express is listening on port ${config.httpPort}`))
}

module.exports = { createEventStore }
