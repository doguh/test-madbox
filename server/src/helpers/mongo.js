const mongodb = require('mongodb');
let db;

async function connect(uri, dbName) {
  const client = await mongodb.MongoClient.connect(uri, {
    useNewUrlParser: true,
  });
  db = client.db(dbName);
}

function collection(name) {
  return db.collection(name);
}

module.exports = {
  connect,
  collection,
};
