const {
  cond,
  set,
  lensProp,
  view,
  identity,
  T
} = require('ramda')

const USER = 'USER'
const USER_CREATED = 'USER_CREATED'
const USER_NAME_CHANGED = 'USER_NAME_CHANGED'
const USER_EMAIL_CHANGED = 'USER_EMAIL_CHANGED'

const nameLens = lensProp('name')
const emailLens = lensProp('email')
const typeLens = lensProp('type')
const setName = set(nameLens)
const setEmail = set(emailLens)
const viewType = view(typeLens)
const isType = type => (_, event) => equals(type, viewType(event))
const createUser = (state, { data }) => data
const setUsername = (state, { data }) => setName(viewName(data), state)
const setUserEmail = (state, { data }) => setEmail(viewEmail(data), state)

const reducer = cond([
  [isType(USER_CREATED),          createUser],
  [isType(USER_NAME_CHANGED),    setUsername],
  [isType(USER_EMAIL_CHANGED),  setUserEmail],
  [T,                               identity]
])

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

// const User = {
//   schema: UserSchema,
//   events: [UserCreated, NameChanged, EmailChanged],
//   commands: [CreateUser, UpdateName, UpdateEmail]
// }

const User = {
  type: 'USER',
  reducer: identity,
  boundaries: [() => null]
}


module.exportd = { User }
