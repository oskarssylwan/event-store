const { head, pipe } = require('ramda')
const { createReceiver, REQUEST, RESPONSE } = require('./receiver')
const { createEventEmitter } = require('./emitter.mock')

const port        = 3000
const middleware  = []
const use         = jest.fn()
const listen      = jest.fn()
const post        = jest.fn()
const express     = { listen, use, post }
const emitter     = createEventEmitter()
const receiver    = createReceiver({ port, middleware, express})(emitter)

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

  describe('Server Setup', () => {
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

  // describe('Emitter', () => {
  //   test(`returned emitter should listen on ${RESPONSE} event type`, () => {
  //     expect(pipe(head, head)(emitter.get(RESPONSE))).toEqual(RESPONSE)
  //   })
  // })




})
