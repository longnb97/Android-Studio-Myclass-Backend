const User = require('../models/user-model');
const TokenHelper = require('../helpers/token-helpers');

module.exports = {
    isAdmin
}

function isAdmin(req, res, next) {
    let authorizationHeader = req.headers['Authorization'];
    let token = authorizationHeader.split('')[0]
    console.log(token);
    next();
}
