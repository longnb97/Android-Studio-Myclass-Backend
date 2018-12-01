'use strict';

require('dotenv').config();
const http = require("http");
const express = require("express"),
  app = (module.exports.app = express());

const logger = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const SocketIO = require('./configs/socket');
// const SocketIo = require('./configs/socketSingleton');
const key = require('./configs/keys');
const apiRoutes = require('./routes/api-routes');

const PORT = process.env.PORT || 5050;
let server = http.createServer(app);
server.listen(PORT, console.log(`Server listening at ${PORT}`));

//Mongoose setup
mongoose.connect(
  `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@ds119734.mlab.com:19734/doandohoa`,
  { useNewUrlParser: true },
  err => { if (!err) console.log('DB CONNECT SUCCESS') })

//Socket io setup : Singleton design pattern
let SocketIo = new SocketIO;
SocketIo.configure(server);

SocketIo.io.on('connection', (socket) => {

  // socket users on connect- disconnect
  SocketIo.connectEvent(socket);
  socket.on('disconnect', () => {
    SocketIo.disconnectEvent(socket);
  });

  //todos
  SocketIo.on('serveremit');
})

//cors setup
const cors = require('cors');
app.use(function (req, res, next) {
  var allowedOrigins = ['http://localhost:1234', 'http://aaa.com'];
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
app.use(express.static('public'));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// error handling
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


const INDEX = path.join(__dirname, 'index.html');
app.get('/', (req, res) => res.sendFile(INDEX));

app.use('/', (req, res, next) => {
  req.io = io
  next();
});


app.use('/api', apiRoutes);
app.use('/auth', require('./routes/auth-routes'));

module.exports = app;


