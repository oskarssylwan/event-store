const SAVE       = 'SAVE'
const SAVED      = 'SAVED'
const RETRIEVE   = 'RETRIEVE'
const RETRIEVED  = 'RETRIEVED'
const ERROR      = 'ERROR'
const LOG        = 'LOG'

const createMongoIntegration = ({ mongo, url, name, collection }) => emitter => {

  const save = data => new Promise((resolve, reject) => {
    mongo.connect(url, (err, client) => {

      client.db(name)
        .collection(collection)
        .insertOne(data, (err, r) => {
          client.close();
          if (err) reject(err);
          resolve(data)
      });

    });
  });

  const load = id => new Promise((resolve, reject) => {
    mongo.connect(url, (err, client) => {

      client.db(name)
        .collection(collection)
        .find({})
        .toArray((err, r) => {
          client.close();
          if (err) reject(err);
          resolve(r);
      });

    });
  });

  const onError = x => emitter.emit(ERROR, x)

  emitter.on(SAVE, x => {

    emitter.emit(LOG, 'Saving events')

    save(x)
    .then(x => emitter.emit(SAVED, x))
    .catch(onError)
  })

  emitter.on(RETRIEVE, x => {

    emitter.emit(LOG, 'Retrieving events')

    load(x)
    .then(x => emitter.emit(RETRIEVED, x))
    .catch(onError)
  })

  return emitter

}

module.exports = { createMongoIntegration, SAVE, SAVED, RETRIEVE, RETRIEVED }
