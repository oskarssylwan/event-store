const {
  createEventReplayer,
  findReducer,
  findBoundaries,
  test
} = require('./core')

const TYPE = 'USER'
const aggregateState = 'final state after all events have been played'
const reducer = jest.fn().mockReturnValue(aggregateState)
const validatorOne = jest.fn()
const validatorTwo = jest.fn()
const eventOne = { type: 'FIRST_EVENT' }
const eventTwo = { type: 'SECOND_EVENT' }
const eventThree = { type: 'THIRD_EVENT' }
const events = [eventOne, eventTwo, eventThree]

const rootAggregate = {
  type: TYPE,
  reducer,
  bounderies: [validatorOne, validatorTwo]
}

const aggregate = createEventReplayer([rootAggregate])(TYPE)(events)
// const temp = test(reducer)

describe('playEvents', () => {

  it('should call reducer over list of events', () => {
    expect(reducer).toHaveBeenNthCalledWith(1, {}, eventOne)
    expect(reducer).toHaveBeenNthCalledWith(2, aggregateState, eventTwo)
    expect(reducer).toHaveBeenNthCalledWith(3, aggregateState, eventThree)
    expect(reducer).toHaveBeenCalledTimes(3)
  })

  it('should call each boundary validator with the resulting aggregate state', () => {
    expect(validatorOne).toHaveBeenCalledWith(aggregateState)
    expect(validatorTwo).toHaveBeenCalledWith(aggregateState)
  })

})

describe('findReducer', () => {
  it('should return reducer function of given aggregate type', () => {
    expect(findReducer(TYPE)([rootAggregate])).toEqual(reducer)
  })
})

describe('findBoundaries', () => {
  it('should return boundaries list of given aggregate type', () => {
    expect(findBoundaries(TYPE)([rootAggregate])).toEqual([validatorOne, validatorTwo])
  })
})
