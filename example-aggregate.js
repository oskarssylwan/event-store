
const UserSchema = {
  type: 'User',
  description: 'Represents a application user',
  properties: {
    initialized: { type: 'integer', default: 0 },
    id: { type: 'string' },
    name: { type: 'string' },
    email: { type: 'string' },
    created: {type: 'string' }
  },
  required: [ 'id', 'name', 'email', 'created' ]
}

const UserCreated = {
  type: 'USER_CREATED',
  data: {
    id: { type: 'string' },
    name: { type: 'string' },
    email: { type: 'string' },
    created: {type: 'string' }
  },
  required: [ 'id', 'name', 'email', 'created' ]
}

const EmailChanged = {
  type: 'EMAIL_CREATED',
  data: { email: { type: 'string' } },
  required: [ 'email' ]
}

const NameChanged = {
  type: 'NAME_CHANGED',
  data: { name: { type: 'string' } },
  required: [ 'name' ]
}

const CreateUser = {
  type: 'CREATE_USER',
  mapsTo: [ 'UserCreated' ],
  data: {
    id: { type: 'string' },
    name: { type: 'string' },
    email: { type: 'string' },
    created: {type: 'string' }
  },
  required: [ 'id', 'name', 'email', 'created' ]
}

const UpdateEmail = {
  type: 'UPDATE_EMAIL',
  mapsTo: [ 'EmailChanged' ],
  data: { email: { type: 'string' } },
  required: [ 'email' ]
}

const UpdateName = {
  type: 'UPDATE_NAME',
  mapsTo: [ 'NameChanged' ],
  data: { name: { type: 'string' } },
  required: [ 'name' ]
}

const User = {
  schema: UserSchema,
  events: [UserCreated, NameChanged, EmailChanged],
  commands: [CreateUser, UpdateName, UpdateEmail]
}

module.exportd = { User }
