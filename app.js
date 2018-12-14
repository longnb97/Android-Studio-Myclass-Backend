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
const config = require('./configs/keys');
const homePage = path.resolve(__dirname, '/public/index.html');

const apiRoutes = require('./routes/api-routes'),
  authRoutes = require('./routes/auth-routes'),
  oauthRoutes = require('./routes/oauth-routes');

const jwt = require('express-jwt'),
  unless = require('express-unless')

const jwtCheck = jwt({
  secret: config.jwtSecret
});
jwtCheck.unless = unless;

/*
 * setting up server
 */
const PORT = process.env.PORT || 5050;
let server = http.Server(app); // http.createServer = http.Server
server.listen(PORT, console.log(`Server listening at ${PORT}`));

/*
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

  //debugger
  socket.on('debug', (data) => {
    console.log(data)
    socket.emit('debug-message', 'ok');
  })

  // event quet the
  socket.on('card', async (cardNumber) => {
    let userExisted = await UserHelper.isExisted(cardNumber);
    if (!userExisted) socket.emit('account-create', 'user not found, navigate to register route')
    else {
      //check in or check out
      let updateQueue = await UserHelper.updateTimee(cardNumber);
      socket.emit('response', 'time updated')
    }
  })

  //

})

/*
 * setting up mongoose
 */
mongoose.connect(
  `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@ds119734.mlab.com:19734/doandohoa`,
  { useNewUrlParser: true },
  err => { if (!err) console.log('DB CONNECT SUCCESS') }
)

/*
 * setting up cors & jwt
 */
const cors = require('cors');
app.use(function (req, res, next) {
  // orgins that are allowed to make a request to server
  var allowedOrigins = ['http://localhost:1234', 'http://localhost:4200', 'http://localhost:4300', 'http://localhost:5000'];
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

/*
 * setting up jwt-unless
 */
app.use(jwtCheck.unless({
  path: [
    '/cannot_get',
    '/unauthorized',
    '/',
    '/public',
    '/auth',
    '/auth/login',
    '/auth/logout',
    '/oauth',
    '/oauth/login',
    '/oauth/logout',
    '/oauth/fb',
    '/api/users',
    '/api/users/socket_emit',
    '/main.html',
    '/index.html',
    '/favicon.ico',

    '/api/users/1/',
    '/api/users/2/'
  ]
}))

/*
 * setting up libraries
 */
app.use(express.static('public'));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/*
 * catch "favicon.ico missing" error
 */
app.use(function (req, res, next) {
  if (req.originalUrl && req.originalUrl.split("/").pop() === 'favicon.ico') return res.sendStatus(204);
  return next();
});

/*
 * setting up routes
 */
app.get('/', (req, res) => res.sendFile(homePage));
app.use('/api', apiRoutes);
app.use('/auth', authRoutes);
app.use('/oauth', oauthRoutes);

/*
 * catch "404" error
 */
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.status(404).send("404 Not Found");
});

/*
 * catch "UnauthorizedError" error
 */
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('Invalid token');
  }
});