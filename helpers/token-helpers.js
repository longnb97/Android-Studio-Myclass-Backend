const jwt = require('jsonwebtoken');
const key = require('../configs/keys');

module.exports = {
    tokenGenerate
}

function tokenGenerate(userInfo){
    return token = jwt.sign(userInfo, key.jwtSecret);
}