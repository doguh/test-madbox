const mongo = require('../helpers/mongo');

async function get() {
  const level = await mongo
    .collection('ld')
    .findOne({}, { projection: { _id: 0, meta: 0 }, sort: { $natural: -1 } });
  return level;
}

async function save(level) {
  await mongo.collection('ld').insertOne({
    ...level,
    meta: {
      date: new Date(),
    },
  });
  return true;
}

module.exports = {
  get,
  save,
};
