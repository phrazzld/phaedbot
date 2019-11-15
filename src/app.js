// phaedbot/src/app.js

const express = require('express');
const app = express();
require('dotenv').config();
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const sanitizer = require('express-sanitizer');
const request = require('request');
const favicon = require('serve-favicon');
const path = require('path');
const config = require('@root/config');
const agent = require('@root/agent');

// Always wear a helmet
app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", 'maxcdn.bootstrapcdn.com'],
      fontSrc: ["'self'", 'maxcdn.bootstrapcdn.com'],
      scriptSrc: ["'self'", 'code.jquery.com'],
    },
  }),
);
app.use(helmet.permittedCrossDomainPolicies());
app.use(
  helmet.featurePolicy({
    features: {
      vibrate: ["'none'"],
      payment: ["'none'"],
      syncXhr: ["'none'"],
      notifications: ["'none'"],
      microphone: ["'none'"],
      camera: ["'none'"],
      geolocation: ["'none'"],
    },
  }),
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(sanitizer());

// use static files
app.use(express.static(path.join(__dirname, 'public')));
// favicon
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

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
  try {
    const agentResponse = await agent.query(req.body.message);
    res
      .status(200)
      .json({agentResponse: agentResponse.queryResult.fulfillmentText});
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

app.post('/event', async (req, res) => {
  console.log('POST /event');
  try {
    const agentResponse = await agent.triggerEvent(req.body.eventName);
    res
      .status(200)
      .json({agentResponse: agentResponse.queryResult.fulfillmentText});
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

module.exports = app;
