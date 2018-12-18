const express = require('express');
const router = express.Router();

// const server = require('../app');
// const SocketClass =require('../configs/socket');
// const socket = new SocketClass(server);

const socket = require('../configs/socketSingleton');
const UserHelper = require('../helpers/user-helpers');
const UserMiddleware = require('../middlewares/user-middlewares');

//   "https://socketiot.herokuapp.com/api/users/socket_emit?topic=yo&data=hello" 
//   request method get to this route:  server will automatically emit to topic 'yo' with data 'hello' 
router.get('/socket_emit', emit);

router.get('/', UserMiddleware.haveAccessToDatabase, UserHelper.getAllSchedule);
router.get('/:id', UserHelper.getSelfSchedule); //params
router.post('/', UserHelper.createAccount);
router.put('/', UserHelper.updateTime);  // update url using query  ex: https://socketiot.herokuapp.com/api/users?id=1234567890

function emit(req, res) {
    socket.emit(req.query.topic, req.query.data);
    res.status(200).send('request sent');
}

module.exports = router;
