const { pipe, merge, over, lensProp, inc } = require('ramda');

const CREATE_USER   = 'CREATE_USER';
const UPDATE_USER   = 'UPDATE_USER';

const USER_CREATED  = 'USER_CREATED';

const fields = [
  { name: 'initialized', type: Number, default: 0, private: true },
  { name: 'id',          type: String, required: true, private: true},
  { name: 'name',        type: String, required: true},
  { name: 'email',       type: String, required: true},
  { name: 'created',     type: String, required: true, private: true},
]

const events = [
  { type: USER_CREATED, fields, process: pipe(merge, over(lensProp('initialized'), inc)) }
]

const commands = [
  { type: CREATE_USER, mapsTo: [ USER_CREATED ] }
]

module.exports = {
  User: {
    name: 'User',
    fields,
    events,
    commands
  }
}
