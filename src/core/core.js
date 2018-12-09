const { Either } = require('monet')
const Future = require('fluture')
const { eitherToFuture } = require('../utility/index')

Future.of('bye')
  .chain(x => eitherToFuture(Either.Left(x)))
  .fork(console.error, console.log)
