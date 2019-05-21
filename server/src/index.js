const express = require('express');
const config = require('./config');
const configureServer = require('./server');
const mongo = require('./helpers/mongo');

const app = express();

async function start() {
  await mongo.connect(config.db.uri, config.db.name);
  console.log(`db connected to ${config.db.uri}`);

  configureServer(app);

  app.listen(config.port, () => {
    console.log(`server running on port ${config.port}`);
  });
}

start().catch(error =>
  console.error('an error occured, terminating...', error)
);
