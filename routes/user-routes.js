const express = require('express');
const router = express.Router();

// const server = require('../app');
// const SocketClass =require('../configs/socket');
// const socket = new SocketClass(server);

const socket = require('../configs/socketSingleton');
const UserHelper = require('../helpers/user-helpers');
const UserMiddleware = require('../middlewares/user-middlewares');

router.get('/', UserMiddleware.isAdmin, UserHelper.getSchedule);
router.post('/', UserHelper.createAccount);
router.put('/:cardNumber', UserHelper.updateTime);

router.get('/emit', (req, res) => {
    socket.emit('announce', 'announced');
    res.send('request sent');
});

router.get('/action', (req, res) => {
    socket.emit(req.query.topic, req.query.data);
    res.send('request sent');
});



module.exports = router;
