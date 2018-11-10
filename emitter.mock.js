const { pipe, forEach, call, head, last, filter, map, equals } = require('ramda');

const createEventEmitter = () => {
  let listeners    = []

  const removeAll  = () => { listeners = [] }
  const getAll     = () => [...listeners]
  const get        = type => filter(pipe(head, equals(type)), listeners)
  const on         = (type, fn) => { listeners.push([type, fn]) }

  const emit = type => pipe(
    filter(pipe(head, equals(type))),
    map(last),
    forEach(call)
  )(listeners)

  return { removeAll, getAll, get, emit, on}
}

module.exports = { createEventEmitter }
