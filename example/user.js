const {
  cond,
  set,
  lensProp,
  view,
  identity,
  T,
  equals
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
const viewEmail = view(emailLens)
const viewName = view(nameLens)
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

const User = {
  type: 'USER',
  reducer: reducer,
  boundaries: [() => null]
}


module.exports = { User }
