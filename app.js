'use strict';

require('dotenv').config();
const http = require("http");
const express = require("express"),
  app = (module.exports.app = express());

const PORT = process.env.PORT || 5050;
let server = http.createServer(app);

const io = require('socket.io').listen(server); //pass a http.Server instance

const morgan = require('morgan');
const bodyParser = require('body-parser');

const path = require('path');
const INDEX = path.join(__dirname, 'index.html');

const key = require('./configs/keys');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

server.listen(PORT, console.log(`Server listening at ${PORT}`));

//cors configs
const cors = require('cors');
app.use(function(req, res, next) {
  var allowedOrigins = ['http://localhost:1234', 'http://aaa.com'];
  var origin = req.headers.origin;
  if(allowedOrigins.indexOf(origin) > -1){
       res.setHeader('Access-Control-Allow-Origin', origin);
  }
  //res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:8020');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  return next();
});

//app configs
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Mongoose setup
mongoose.connect(
  `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@ds119734.mlab.com:19734/doandohoa`,
  { useNewUrlParser: true },
  err => { if (!err) console.log('DB CONNECT SUCCESS') })

//Socket io configs
io.on('connection', function (socket) {
  //setup socketio connect, disconnect 
  console.log(`${socket.id}:  Đã kết nối(Connected)`);
  socket.on('disconnect', () =>
    console.log(`Hủy kết nối(Disconnected) :  ${socket.id}`)
  );

  socket.emit("socketid", socket.id);

  // mobile app
  socket.on('client-state-on', data => {
    socket.emit('client-state-on', data);
  });//true

  socket.on('client-state-off', data => {
    socket.emit('client-state-off', data);
  });//false

});

//app configs
app.get('/', (req, res) => res.sendFile(INDEX));

app.use('/api', require('./routes/api-routes'));
app.use('/auth', require('./routes/auth-routes'));


