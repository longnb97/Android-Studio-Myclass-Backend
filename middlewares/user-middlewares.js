const User = require('../models/user-model');

module.exports = {
    isAdmin
}

function isAdmin(req, res, next) {
    console.log(req.session.user);
    if (!req.session.user || !req.session.user.email || !req.session.user.role) res.status(403).json({ message:'session empty' });
    else {
        console.log('else')
        if (req.session.user.role === 'admin') next();
        else res.status(403).json({ messsage: 'method not allowed' });
    }
    // next();
}
