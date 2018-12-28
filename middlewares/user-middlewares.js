const User = require('../models/user-model');
const TokenHelper = require('../helpers/token-helpers');

module.exports = {
    isAdmin
}

function isAdmin(req, res, next) {
    let authorizationHeader = req.headers['authorization'];
    let token = authorizationHeader.split(' ')[1];
    req.userId = TokenHelper.decodeToken(token)._id
    User.findById(req.userId)
        .then(userFound => {
            if (!userFound) res.status(400).json()
            else {
                if (userFound.role === 'admin') next();
                else res.status(403).json({ message: " permission denied, admin only " })
            }
        })
        .catch(error => res.status(500).json({ message: "server error" }))
}
