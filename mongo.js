const createMongoIntegration = ({ mongo, url, name, collection }) => {

  const save = data => new Promise((resolve, reject) => {
    mongo.connect(url, (err, client) => {

      client.db(name)
        .collection(collection)
        .insertOne(data, (err, r) => {
          client.close();
          if (err) reject(err);
          resolve('Data saved successfully')
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

  return { save, load }

}

module.exports = { createMongoIntegration }
