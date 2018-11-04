const mongodb = require('mongodb').MongoClient;

const URL         = process.env.MONGO_ADRESS;
const NAME        = process.env.MONGO_NAME;
const COLLECTION  = process.env.MONGO_COLLECTION;

const save = data => new Promise((resolve, reject) => {
  mongodb.connect(URL, (err, client) => {

    client.db(NAME)
      .collection(COLLECTION)
      .insertOne(data, (err, r) => {
        client.close();
        if (err) reject(err);
        resolve('successfully')
    });

  });
});

const load = id => new Promise((resolve, reject) => {
  mongodb.connect(URL, (err, client) => {

    client.db(NAME)
      .collection(COLLECTION)
      .find({})
      .toArray((err, r) => {
        client.close();
        if (err) reject(err);
        resolve(r);
    });

  });
});


module.exports = { save, load }
