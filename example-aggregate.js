
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
  mapsTo: [ 'CREATE_USER' ],
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
  mapsTo: [ 'UPDATE_EMAIL' ],
  data: { email: { type: 'string' } },
  required: [ 'email' ]
}

const NameChanged = {
  type: 'NAME_CHANGED',
  mapsTo: [ 'UPDATE_NAME' ],
  data: { name: { type: 'string' } },
  required: [ 'name' ]
}

const CreateUser = {
  type: 'CREATE_USER',
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
  data: { email: { type: 'string' } },
  required: [ 'email' ]
}

const UpdateName = {
  type: 'UPDATE_NAME',
  data: { name: { type: 'string' } },
  required: [ 'name' ]
}

const User = {
  schema: UserSchema,
  events: [UserCreated, NameChanged, EmailChanged],
  commands: [CreateUser, UpdateName, UpdateEmail]
}

module.exportd = { User }
