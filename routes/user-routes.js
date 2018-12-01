const express = require('express');
const router = express.Router();

const io = require('socket.io')

router.use('/', (req, res, next) => {
    router.io = io;
    next();
})

router.use('/emit', (req, res) => {
    req.router.emit('test','thanhcong');
})

module.exports = router;
