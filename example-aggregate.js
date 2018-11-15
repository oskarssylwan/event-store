
const UserSchema = {
  title: 'User',
  description: 'This is a user schema',
  type: 'object',
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
  title: 'UserCreated',
  description: 'Event that for user creation',
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    email: { type: 'string' },
    created: {type: 'string' }
  },
  required: [ 'id', 'name', 'email', 'created' ]
}

const EmailChanged = {
  title: 'EmailChanged',
  description: 'Email has been changed event',
  type: 'object',
  properties: {
    email: { type: 'string' },
  },
  required: [ 'email' ]
}

const NameChanged = {
  title: 'NameChanged',
  description: 'Name has been changed event',
  type: 'object',
  properties: {
    name: { type: 'string' },
  },
  required: [ 'name' ]
}

const CreateUser = {
  title: 'CreateUser',
  description: 'Command for creating a user',
  type: 'object',
  mapsTo: [ 'UserCreated' ],
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    email: { type: 'string' },
    created: {type: 'string' }
  },
  required: [ 'id', 'name', 'email', 'created' ]
}

const UpdateEmail = {
  title: 'UpdateEmail',
  description: 'Command for updating email',
  type: 'object',
  mapsTo: [ 'EmailChanged' ],
  properties: {
    email: { type: 'string' },
  },
  required: [ 'email' ]
}

const UpdateName = {
  title: 'UpdateName',
  description: 'Command for updating name',
  type: 'object',
  mapsTo: [ 'NameChanged' ],
  properties: {
    name: { type: 'string' },
  },
  required: [ 'name' ]
}

const User = {
  schema: UserSchema,
  events: [UserCreated, NameChanged, EmailChanged],
  commands: [CreateUser, UpdateName, UpdateEmail]
}
