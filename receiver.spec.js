const { createReceiver, REQUEST, RESPONSE } = require('./receiver')

const port        = 3000
const middleware  = []
const on          = jest.fn()
const emit        = jest.fn()
const use         = jest.fn()
const listen      = jest.fn()
const post        = jest.fn()
const emitter     = { on, emit }
const express     = { listen, use, post }
const receiver    = createReceiver({ port, middleware, express})(emitter)


// TODO: add test cases for the event emitter

describe('Receiver Module', () => {

  describe('Public API', () => {

    it('should export a factory method', () => {
      expect(typeof createReceiver).toBe('function')
    })

    it('should export event types', () => {
      expect(REQUEST).toBeTruthy()
      expect(RESPONSE).toBeTruthy()
    })

  })

  it('should listen on correct port', () => {
    expect(listen).toBeCalledWith(port, expect.any(Function))
  })

  it('should use supplied middleware', () => {
    expect(use).toBeCalledWith(middleware)
  })

  it('should listen on incoming requests on root route', () => {
    expect(post).toBeCalledWith('/', expect.any(Function))
  })

})
