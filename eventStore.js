const {
  map,
  merge,
  prop,
  not,
  propOr,
  xprod,
  __,
  flatten,
  converge,
  init,
  join,
  last,
  mergeAll,
  pipe,
  filter,
  over,
  lensProp,
  concat,
  reject,
  keys,
  toUpper,
  identity,
  always,
  lensIndex,
  compose,
  set,
  call,
  prepend,
  apply,
  unapply,
  head,
  propEq,
  find,
  tap
} = require('ramda')

const PROCESS_COMMAND   = 'PROCESS_COMMAND'
const COMMAND_PROCESSED = 'COMMAND_PROCESSED'
const ERROR             = 'ERROR'
const LOG               = 'LOG'

const COMMON_FIELD_EVENTS = [
  ['CHANGED', set],
];

const AGGREGATE_DEFAULTS = {
  events:   {},
  fields:   [],
  commands: {}
}

const isPrivate                 = prop('private')
const isRequired                = prop('required')
const eqType                    = propEq('type')
const getName                   = prop('name')
const getType                   = prop('type')
const getFields                 = prop('fields')
const getData                   = prop('data')
const getEvents                 = prop('events')
const getCommands               = prop('commands')
const getPublicFields           = pipe(getFields, reject(isPrivate))
const getPublicFieldNames       = pipe(getPublicFields, map(getName))
const overEvents                = over(lensProp('events'))
const overFields                = over(lensProp('fields'))
const overFirst                 = over(lensIndex(0))
const overSecond                = over(lensIndex(1))
const overThird                 = over(lensIndex(2))
const toObject                  = (k, v) => ({ [k]: v })
const toArray                   = unapply(identity)
const toPrefix                  = pipe(toUpper, concat(__, '_'))
const toSuffix                  = pipe(toUpper, concat('_'))
const prependCommonFieldEvents  = xprod(__, COMMON_FIELD_EVENTS)

const createCommonEvent = ([name, field, commonEvent]) => pipe(
  identity,
  overFirst(toPrefix),
  overSecond(pipe(getName, toUpper)),
  overThird(pipe(overFirst(toSuffix), overSecond(call(__, lensProp(getName(field)))))),
  flatten,
  converge(toObject, [pipe(init, join('')), last])
)([name, field, commonEvent])

const createCommonEvents = aggregate => pipe(
  getPublicFields,
  prependCommonFieldEvents,
  map(prepend(getName(aggregate))),
  map(createCommonEvent)
)(aggregate)

const addCommonEvents       = converge(overEvents, [pipe(createCommonEvents, merge), identity])
const addCommons            = pipe(addCommonEvents)
const addDefaults           = merge(AGGREGATE_DEFAULTS)
const asAggregate           = pipe(addDefaults, addCommons)
const createProcessCommand  = aggregates => command => command

const createEventStore = ({ aggregates }) => emitter => {
  const emit            = type => data => {
    emitter.emit(type, data);
  }
  const processCommand  = createProcessCommand(aggregates)
  emitter.emit(LOG, 'Processing commands')
  emitter.on(PROCESS_COMMAND, pipe(processCommand, emit(COMMAND_PROCESSED)))

  return emitter
}

module.exports = { createEventStore, PROCESS_COMMAND, COMMAND_PROCESSED }
