const express = require('express');
const router = express.Router();

// const server = require('../app');
// const SocketClass = require('../configs/socket');
// const socket = new SocketClass(server);

const socket = require('../configs/socketSingleton');
const UserHelper = require('../helpers/user-helpers');
const UserMiddleware = require('../middlewares/user-middlewares');


router.get('/socket_emit', emit);   // "https://socketiot.herokuapp.com/api/users/socket_emit?topic=yo&data=hello" 
                                    // make request (get) to this route: server will emit to topic 'yo' with data 'hello'  

router.get('/', UserMiddleware.isAdmin, UserHelper.getAllSchedule);
router.get('/:id', UserHelper.getSelfSchedule); //params

router.post('/basic', UserHelper.createUserAccount);
router.post('/admin', UserMiddleware.isAdmin, UserHelper.createAdminAccount);
router.put('/', UserHelper.updateTime);  // update (using query) to id 123456, ex: https://socketiot.herokuapp.com/api/users?id=123456


function emit(req, res) {
    socket.emit(req.query.topic, req.query.data);
    res.status(200).send('request sent');
}

module.exports = router;
