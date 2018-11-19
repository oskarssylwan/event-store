const {
  filter,
  prop,
  keys,
  contains,
  identity,
  equals,
  pipe,
  set,
  lensProp,
  __,
  unless,
  when,
  any,
  eqProps,
  complement,
  always,
  curry,
  find,
  omit,
  map,
  forEach,
  project,
  pick,
  tap,
  chain,
  reverse,
  head,
  apply,
  ifElse
} = require('ramda')

const LOAD_AGGREGATE = 'LOAD_AGGREGATE'
const AGGREGATE_LOADED = 'AGGREGATE_LOADED'
const PROCESS_COMMAND = 'PROCESS_COMMAND'
const COMMAND_PROCESSED = 'COMMAND_PROCESSED'
const ERROR = 'ERROR'
const LOG = 'LOG'

const COMMAND_UNDEFINED = 'The given command cannot be mapped to any aggregate'

const isError = pipe(prop('type'), equals(ERROR))
const asError = set(lensProp('message'), __, {type: ERROR})
const asJSONSchema = pipe(
  data => ({...data, properties: data.data}),
  omit(['type', 'mapsTo', 'data']),
)

const getCommandSchema = curry((command, commandSchemas) => {
  const schema = find(eqProps('type', command), commandSchemas)
  return schema ? schema : asError(COMMAND_UNDEFINED)
})

const validateCommand = curry((commandSchema, command) => {
  var Ajv = require('ajv')
  var ajv = new Ajv({allErrors: true})
  var validate = ajv.compile(asJSONSchema(commandSchema))
  var valid = validate(prop('data', command))
  return valid ? valid : { type: ERROR, message: validate.errors}
})

const createEvent = curry((command, schema) => {
  const dataKeys = keys(schema.data)
  const data = pick(dataKeys, command.data)
  return { type: schema.type, data }
})

const createMatchingEvents = curry((eventSchemas, command) => {
  return pipe(
    filter(schema => schema.mapsTo.includes(command.type)),
    map(createEvent(command))
  )(eventSchemas)
})

const validateEvents = identity

const processCommand = curry((eventSchemas, commandSchemas, command) => {
  const commandSchema = getCommandSchema(command, commandSchemas)
  if (isError(commandSchema)) return commandSchema
  const valid = validateCommand(commandSchema, command)
  if (isError(valid)) return valid
  const events = createMatchingEvents(eventSchemas, command)
  return events
})

const createEventStore = ({ aggregates }) => emitter => {
  const eventSchemas = pipe(map(prop('events')), flatten)(aggregates)
  const commandSchemas = pipe(map(prop('commands')), flatten)(aggregates)

  const emit = type => data => { emitter.emit(type, data) }

  emitter.on(PROCESS_COMMAND, command => {
      emit(LOG, 'Processing commands')
      const events = processCommand(eventSchemas, commandSchemas, command)
      if (isError(event)) emit(ERROR, events)
      emit(COMMAND_PROCESSED, events)
  })

  return emitter
}




module.exports = {
  ERROR,
  LOAD_AGGREGATE,
  AGGREGATE_LOADED,
  COMMAND_UNDEFINED,
  getCommandSchema,
  validateCommand,
  createMatchingEvents,
  validateEvents,
  processCommand
}
