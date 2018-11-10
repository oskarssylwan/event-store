const SAVE       = 'SAVE';
const SAVED      = 'SAVED';
const RETRIEVE   = 'RETRIEVE';
const RETRIEVED  = 'RETRIEVED';

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

  emitter.on(SAVE, x => save(x).then(x => emitter.emit(SAVED, x)))
  emitter.on(RETRIEVE, x => load(x).then(x => emitter.emit(RETRIEVED, x)))


  return emitter

}

module.exports = { createMongoIntegration, SAVE, SAVED, RETRIEVE, RETRIEVED }
