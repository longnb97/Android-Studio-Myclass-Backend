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

const UserHelper = require('./helpers/user-helpers');

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

const PORT = process.env.PORT || 5000;
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
  //data la ma the vidu: 423423423
  socket.on('debug', (data) => {
    UserHelper.updateTimee(data);
    socket.emit('debug-message', 'ok');
  })
})

/**
 * setting up mongoose
 */
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

/**
 * setting up jwt-unless
 */
app.use(jwtCheck.unless({
  path: [
    '/cannot_get',
    // '/unauthorized',
    '/',
    '/public',
    '/auth',
    '/auth/login',
    '/auth/logout',
    '/auth/fb',
    '/main.html',
    '/api/users/action',
    '/api/users',
    '/api/users/11',
    '/api/users/12'
  ]
}))

/**
 * setting up express.js
 */
app.use(express.static('public'));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => res.send("Home Page"));

app.use('/api', apiRoutes);
app.use('/auth', require('./routes/auth-routes'));
app.get('/cannot_get', (req, res) => res.send('ok'));
/*
 * error handling
 */
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('invalid token...');
  }
});

app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.status(404).send("404 Not Found");
});







