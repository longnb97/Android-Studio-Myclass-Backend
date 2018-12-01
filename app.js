'use strict';

require('dotenv').config();
const http = require("http");
const express = require("express"),
  app = (express());

const logger = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const socketHelper = require('./configs/socketSingleton');
const key = require('./configs/keys');
const apiRoutes = require('./routes/api-routes');

const jwt = require('express-jwt'),
  unless = require('express-unless'),
  config = require('./configs/keys');

const jwtCheck = jwt({
  secret: config.jwtSecret
});

jwtCheck.unless = unless;

const PORT = process.env.PORT || 5050;
let server = http.Server(app); // http.createServer = http.Server
server.listen(PORT, console.log(`Server listening at ${PORT}`));

/**
 * setting up socket.io : singleton design pattern
 */
socketHelper.configure(server);
socketHelper.io.on('connection', (socket) => {
  // on connection, disconnection
  socketHelper.connectEvent(socket);
  socket.on('disconnect', () => {
    socketHelper.disconnectEvent(socket);
  });
  //todos
  socket.on('serveremit', (data) => console.log(data));
})

//Mongoose setup
mongoose.connect(
  `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@ds119734.mlab.com:19734/doandohoa`,
  { useNewUrlParser: true },
  err => { if (!err) console.log('DB CONNECT SUCCESS') }
)

/**
 * setting up cors & jwt
 */
const cors = require('cors');
app.use(function (req, res, next) {
  var allowedOrigins = ['http://localhost:1234', 'http://localhost:4200', 'http://localhost:4300'];
  var origin = req.headers.origin;
  if (allowedOrigins.indexOf(origin) > -1) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  //res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:8020');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  return next();
});

//app configs
app.use(jwtCheck.unless({
  path:[
    '/auth'
  ]
}))

/**
 * setting up express.js
 */
app.use(express.static('public'));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const INDEX = path.join(__dirname, 'index.html');
app.get('/', (req, res) => res.sendFile(INDEX));

app.use('/api', apiRoutes);
app.use('/auth', require('./routes/auth-routes'));

/*
 * catch 404 and forward to error handler
 */
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});




