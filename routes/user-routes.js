const express = require('express');
const router = express.Router();

const io = require('socket.io')

app.use('/', (req, res, next) => {
    router.io = io;
    next();
})

app.use('/emit', (req, res) => {
    req.router.broadcast('test','data');
})

module.exports = router;
