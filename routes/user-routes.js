const express = require('express');
const router = express.Router();

// const server = require('../app');
// const SocketClass =require('../configs/socket');
// const socket = new SocketClass(server);

const socket = require('../configs/socketSingleton');

router.get('/emit', (req, res) => {
    socket.emit('emitt', 'thanhcong');
    res.send('request sent');
})

router.get('/action', (req, res) => {
    socket.emit(req.query.topic, req.query.data);
    res.send('request sent');
})

module.exports = router;
