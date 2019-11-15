// phaedbot/src/server.js

require('module-alias/register');
const app = require('@root/app');
const config = require('@root/config');

app.listen(config.port, err => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Phaedbot here! Listening on port ${config.port}.`);
  }
});
