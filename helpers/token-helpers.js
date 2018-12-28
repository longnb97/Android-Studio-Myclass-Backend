const jwt = require('jsonwebtoken');
const key = require('../configs/keys');

module.exports = {
    generateToken,
    decodeToken
}

function generateToken(userInfo) {
    return token = jwt.sign(userInfo, key.jwtSecret, { expiresIn: 60 * 60 * 24 });
}

function decodeToken(token){
    let decoded = jwt.verify(token, key.jwtSecret);
    return decoded._id;
}