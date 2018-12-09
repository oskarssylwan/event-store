const { Either } = require('monet')
const mongo = require('mongodb').MongoClient
const Future = require('fluture')

const createMongoIntegration = config => {

  const save = data => Future((reject, resolve) => {
    mongo.connect(config.url, (err, client) => {

      client.db(config.name)
        .collection(config.collection)
        .insertOne(data, (err, r) => {
          client.close();
          if (err) reject(err);
          resolve(data)
      });

    });
  });

  const load = aggregateId => Future((reject, resolve) => {
    mongo.connect(config.url, (err, client) => {

      client.db(config.name)
        .collection(config.collection)
        .find({})
        .toArray((err, r) => {
          client.close();
          if (err) reject(err);
          resolve(r);
      });

    });
  });

  return { save, load }

}

module.exports = { createMongoIntegration }
