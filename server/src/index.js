const express = require('express');
const config = require('./config');
const configureServer = require('./server');

const app = express();

app.listen(config.port, async () => {
  configureServer(app);
  console.log(`server running on port ${config.port}`);
});
