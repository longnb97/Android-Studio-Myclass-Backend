const express = require('express');
const router = express.Router();

// const server = require('../app');
// const SocketClass =require('../configs/socket');
// const socket = new SocketClass(server);

const socket = require('../configs/socketSingleton');
const UserHelper = require('../helpers/user-helpers');
const UserMiddleware = require('../middlewares/user-middlewares');

router.get('/socket_emit', emit);
router.get('/:id', UserHelper.getSelfSchedule);
router.get('/', UserMiddleware.isAdmin, UserHelper.getAllSchedule);
router.post('/', UserHelper.createAccount);
router.put('/:cardNumber', UserHelper.updateTime);


function emit(req, res) {
    socket.emit(req.query.topic, req.query.data);
    res.status(200).send('request sent');
}

module.exports = router;
