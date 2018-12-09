const { Either } = require('monet')
const Future = require('fluture')

const createMongoIntegration = mongo => config => {

  const saveEvents = data => Future((reject, resolve) => {
    mongo.connect(config.url, (err, client) => {

      client.db(config.name)
        .collection(config.collection)
        .insertMany(data, (err, r) => {
          console.log('data', data)
          client.close();
          if (err) reject(err);
          resolve(data)
      });

    });
  });

  const loadEvents = aggregateId => Future((reject, resolve) => {
    mongo.connect(config.url, (err, client) => {

      client.db(config.name)
        .collection(config.collection)
        .find({ aggregateId })
        .toArray((err, r) => {
          client.close();
          if (err) reject(err);
          resolve(r);
      });

    });
  });

  return { saveEvents, loadEvents }

}

module.exports = { createMongoIntegration }
