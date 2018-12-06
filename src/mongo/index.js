const { Either } = require('monet')
const mongo = require('mongodb').MongoClient
const Future = require('fluture')

const createMongoIntegration = config => {

  const save = data => Future((resolve, reject) => {
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

  return { save }

}

module.exports = { createMongoIntegration }
