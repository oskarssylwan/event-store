const { createReceiver } = require('./receiver.factory')
module.exports = { createReceiver }


// const recevier () => {}
// const handleStreamRequest = x => x
// const handleProjectionRequest = x => x
//
// recevier
//   .on('POST', '/stream/:aggregateType/:aggregateId')
//   .pipe(handleStreamRequest)
//   .send()
//
// recevier
//   .on('POST', '/stream/:aggregateType/:aggregateId')
//   .pipe(handleProjectionRequest)
//   .send()
