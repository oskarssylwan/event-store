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
  map
} = require('ramda')

const LOAD_AGGREGATE = 'LOAD_AGGREGATE'
const AGGREGATE_LOADED = 'AGGREGATE_LOADED'
const PROCESS_EVENTS = 'PROCESS_EVENTS'
const EVENTS_PROCESSED = 'EVENTS_PROCESSED'
const ERROR = 'ERROR'
const LOG = 'LOG'

const typeLens = lensProp('type')
const reducerLens = lensProp('reducer')
const bounderiesLens = lensProp('bounderies')
const viewType = view(typeLens)
const viewReducer = view(reducerLens)
const viewBounderies = view(bounderiesLens)
const findReducer = type => pipe(find(pipe(viewType, equals(type))), viewReducer)
const findBoundaries = type => pipe(find(pipe(viewType, equals(type))), viewBounderies)

const createEventReplayer = curry((aggregates, type, events) => {
  const aggregate = reduce(findReducer(type)(aggregates), {}, events)
  const errors = map(applyTo(aggregate), findBoundaries(type)(aggregates))
})

const createEventStore = ({ aggregates }) => emitter => {

  const emit = type => data => {
    emitter.emit(type, data);
  }

  emitter.on(PROCESS_EVENTS, x => {
    emit(LOG, 'processing event')
    emit(EVENTS_PROCESSED, x)
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
  findBoundaries,
  test
}
