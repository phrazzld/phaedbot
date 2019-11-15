// phaedbot/src/server.js

require('module-alias/register');
const express = require('express');
const app = express();
require('dotenv').config();
const config = require('@root/config');
const sanitizer = require('express-sanitizer');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const request = require('request');
const favicon = require('serve-favicon');
const path = require('path');
const agent = require('@root/agent');

// use static files
app.use(express.static(path.join(__dirname, 'public')));

// favicon
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// parse POSTs
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(sanitizer());

// ensure https
if (config.isProd) {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}

// render homepage
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/message', async (req, res) => {
  console.log('POST /message');
  console.log(`req.body.message: ${req.body.message}`);
  try {
    const agentResponse = await agent.query(req.body.message);
    console.log('agentResponse');
    console.log(agentResponse);
    res
      .status(200)
      .json({agentResponse: agentResponse.queryResult.fulfillmentText});
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

app.listen(config.port, err => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Phaedbot here, listening on port ${config.port}.`);
  }
});