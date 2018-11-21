const {
  lensProp,
  view,
  curry,
  pipe,
  find,
  equals,
  reduce,
  identity,
  applyTo,
  map,
  reject,
  is,
  isEmpty,
  isNil
} = require('ramda')

const LOAD_AGGREGATE = 'LOAD_AGGREGATE'
const AGGREGATE_LOADED = 'AGGREGATE_LOADED'
const PROCESS_EVENTS = 'PROCESS_EVENTS'
const EVENTS_PROCESSED = 'EVENTS_PROCESSED'
const ERROR = 'ERROR'
const LOG = 'LOG'

const typeLens = lensProp('type')
const reducerLens = lensProp('reducer')
const boundariesLens = lensProp('boundaries')
const viewType = view(typeLens)
const viewReducer = view(reducerLens)
const viewBounderies = view(boundariesLens)
const findReducer = type => pipe(find(pipe(viewType, equals(type))), viewReducer)
const findBoundaries = type => pipe(find(pipe(viewType, equals(type))), viewBounderies)
const asError = messages => ({ type: ERROR, messages: is(String, messages) ? [messages] : messages})
const emit = curry((emitter, type, data) => emitter.emit(type, data))

const createEventReplayer = curry((aggregates, type, events) => {
  const aggregate = reduce(findReducer(type)(aggregates), {}, events)
  const errors = pipe(map(applyTo(aggregate)), reject(isNil) )(findBoundaries(type)(aggregates))
  return isEmpty(errors) ? aggregate : asError(errors)
})

const createEventStore = ({ aggregates }) => emitter => {
  emitter.on(PROCESS_EVENTS, x => {
    emit(emitter, LOG, 'processing event')
    emit(emitter, EVENTS_PROCESSED, x)
  })

  return emitter
}


module.exports = {
  ERROR,
  LOG,
  EVENTS_PROCESSED,
  PROCESS_EVENTS,
  LOAD_AGGREGATE,
  AGGREGATE_LOADED,
  createEventStore,
  createEventReplayer,
  findReducer,
  findBoundaries
}
