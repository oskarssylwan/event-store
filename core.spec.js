const { __ , prop} = require('ramda')
const {
  ERROR,
  COMMAND_UNDEFINED,
  getCommandSchema,
  validateCommand
} = require('./core')
const { createEventEmitter } = require('./emitter.mock')
const { User } = require('./example-aggregate')

const commandSchema = {
  type: 'CREATE_USER',
  mapsTo: [ 'USER_CREATED' ],
  data: {
    id: { type: 'string' },
    name: { type: 'string' },
    email: { type: 'string', format: 'email' },
    created: {type: 'string' }
  },
  required: [ 'id', 'name', 'email', 'created' ]
}

const eventSchema = {
  type: 'USER_CREATED',
  data: {
    id: { type: 'string' },
    name: { type: 'string' },
    email: { type: 'string' },
    created: {type: 'string' }
  },
  required: [ 'id', 'name', 'email', 'created' ]
}

const command = {
  type: 'CREATE_USER',
  data: {
    id: '123',
    name: 'Root',
    email: 'noreply@hotmail.com',
    created: '543'
  }
}

const invalidCommand = {
  type: 'CREATE_USER',
  data: {
    id: 123,
    name: 'Root',
    email: 'not-an-email',
    created: 123
  }
}

describe('getCommandSchema', () => {
  const getSchema = getCommandSchema(__, [ commandSchema ])

  it('should return the schema of the given command', () => {
    expect(getSchema(command)).toBe(commandSchema)
  })

  it(`should return an error if the given command is't defined on any aggregate`, () => {
    expect(getSchema({ type: 'UNDEFINED', data: {} })).toEqual({ type: ERROR, message: COMMAND_UNDEFINED})
  })

})

describe('validateCommand', () => {
  const validate = validateCommand(commandSchema)

  it('should return true if the properties of the command conforms to matching schema', () => {
    expect(validate(command)).toBe(true)
  })

  it(`should return an error if the command breaks schema rules`, () => {
    expect(prop('type', validate(invalidCommand))).toEqual(ERROR)
  })

})

describe('asJSONSchema', () => {

  // it('should omit properties not relevant in validation', () => {
  //   expect(commandSchema)
  // })


})
