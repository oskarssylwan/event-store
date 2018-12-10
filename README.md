# Event Store
Proof of concept for an event store implemented in nodejs.

## Getting started
Assuming you have initialised a project, the following will create:
* a http server that will parse incoming events
* a tcp server that will publish parsed events

```
npm i --save @oskarssylwan/event-store
```
```
const { createEventStore } = require('@oskarssylwan/event-store')

const config = {
  httpPort: 3000,
  tcpPort: 3001,
  mongoAdress: 'mongodb://localhost:27017/dev-store',
  mongoName: 'dev-store',
  mongoCollection: 'events',
}

const aggregateRoot = {
  type: 'EXAMPLE_AGGREGATE',
  reducer: (state, event) => state,
  boundaries: [aggregate => null]
}

createEventStore(config)([ aggregateRoot ])

```

## Aggregate root
createEventStore() takes an array of aggregate roots as an argument. Aggregate roots are responsible for validating domain boundaries as well as providing means of creating projections. An aggregate root needs to have the following properties.

### type
The type property is used to identify the aggregate root and link the incoming events to a specific set of domain boundaries.
```
const user = { type: 'USER' }
```

### reducer
The reducer is used to create the current state of the aggregate.
Each event will be passed to the reducer function along with the previous aggregate state.
It is then up to the reduce to create a new state based on the event.
If you are familiar with redux this will feel quite natural for you.
```
const reducer = (state, event) => {
  switch (event.type) {
    case 'NAME_CHANGED':
      return { ...state, name: event.data.name }
  }
}

const user = {
  type: 'USER',
  reducer,
}
```

### boundaries
Aggregate root boundaries are implemented as an array of functions that validates the state of the aggregate.
Each function is called with the aggregate state after all events have been through the reducer.
If the aggregate state breaks a domain boundary the validator function should return an error explaining why it failed validation. However, if the aggregate is valid the validator function is expected to return null.
```
const nameMoreThan2Characters = user => user.name.length > 2
  ? null
  : new Error('Name needs to be more than two characters long')

const user = {
  type: 'USER',
  reducer: reducer,
  boundaries: [ nameMoreThan2Characters ]
}

```

## Events
```
POST /stream/:aggregateType/:aggregateId
```
```
const namedChangedEvent = {
  type: 'NAMED_CHANGED',
  data: { name: 'Harry Potter' }
}
```

## Projections
```
GET /projection/:aggregateType/:aggregateId
```

## Roadmap
* error handling
* event validation
* snapshotting
* concurrency handling
