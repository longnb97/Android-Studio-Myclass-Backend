const express = require('express');
const router = express.Router();

const SocketIo = require('../configs/socketSingleton');



router.get('/emit', (req, res) => {
    SocketIo.emit('test', 'thanhcong');
    res.send('request sent');
})

router.get('/action', (req, res) => {
    SocketIo.emit(req.query.topic, req.query.data);
    res.send('request sent');
})

module.exports = router;
