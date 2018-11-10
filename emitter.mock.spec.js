const { createEventEmitter } = require('./emitter.mock')

const COMPLETED = 'completed'
const ERROR = 'error'

const emitter = createEventEmitter()
const completedListener = jest.fn()
const errorListener = jest.fn()
const anotherListener = jest.fn()

emitter.on(COMPLETED, completedListener)
emitter.on(COMPLETED, anotherListener)
emitter.on(ERROR, errorListener)

const listeners = emitter.getAll()
const completedListeners = emitter.get(COMPLETED)

emitter.emit(COMPLETED)
emitter.removeAll()

describe('Mock Event Emitter', () => {

  it('should call listeners listening on the emitted event type', () => {
    expect(completedListener).toHaveBeenCalled()
    expect(anotherListener).toHaveBeenCalled()
  })

  it(`shouldn't call listeners that haven't subscribed to the emitted event type`, () => {
    expect(errorListener).not.toHaveBeenCalled()
  })

  it('should be possible to get all current listeners', () => {
    expect(listeners).toHaveLength(3)
  })

  it('should be possible to get emitters by type', () => {
    expect(completedListeners).toHaveLength(2)
  })

  it('should be possible to remove all event listeners', () => {
    expect(emitter.getAll()).toHaveLength(0)
  })

})
