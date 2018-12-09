const { Either } = require('monet')
const Future = require('fluture')

const eitherToFuture = either =>
  either.isRight()
    ? Future.of(either.right())
    : Future.reject(either.left())

module.exports = { eitherToFuture }
