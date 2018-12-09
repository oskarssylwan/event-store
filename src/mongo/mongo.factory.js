const { createMongoIntegration } = require('./mongo')
const mongo = require('mongodb').MongoClient

module.exports = { createMongoIntegration: createMongoIntegration(mongo) }
