const User = require('../models/user-model');

module.exports = {
    isAdmin
}

function isAdmin(req, res, next) {
    const email = req.body.email;
    User.findOne({ email })
        .then(userFound => {
            if (!userFound) res.status(404).json({ message: 'user not found' });
            else {
                if (userFound.role === 'admin') next();
                else res.status(403).json({message:"method not allowed"});
            }
        })
        .catch(err => res.status(500).json(err));
}