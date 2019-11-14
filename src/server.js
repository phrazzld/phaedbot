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

app.listen(config.port, err => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Phaedbot here, listening on port ${config.port}.`);
  }
});
