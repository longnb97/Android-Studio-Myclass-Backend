const jwt = require('jsonwebtoken');
const key = require('../configs/keys');

module.exports = {
    generateToken
}

function generateToken(userInfo) {
    return token = jwt.sign(userInfo, key.jwtSecret, { expiresIn: 60 * 60 * 24 });
}