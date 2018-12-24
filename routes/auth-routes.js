const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const session = require('express-session');

const User = require('../models/user-model');
const TokenHelper = require('../helpers/token-helpers');

module.exports = router;

router.post('/login', login);
router.get('/logout', logout);
router.post('/fbLogin', loginWithFacebook);
router.post('/googleLogin', loginWithGoogle);

router.get('/session', (req, res) => {
    if (!req.session.user) res.json('nothing here');
    else res.send(req.session.user);
});

function login(req, res) {
    const { email, password } = req.body;
    User.findOne({ email })
        .then(userFound => {
            if (!userFound) res.status(404).json({ success: 0, message: 'user not found' });
            else {
                if (userFound.hashPassword) {
                    let compare = bcrypt.compareSync(password, userFound.hashPassword);
                    if (!compare) res.status(400).json({ success: 0, message: 'wrong password' });
                    else {
                        const { email, displayName, cardNumber } = userFound;
                        const userInfo = { email, displayName, cardNumber };
                        let token = TokenHelper.generateToken(userInfo);
                        req.session.user = {
                            email,
                            role: userFound.role,
                            token
                        };
                        res.status(200).json({ success: 1, message: 'logging in, navigate to app front page', token, userFound });
                    }
                }
            }
        })
        .catch(err => res.status(500).send(err))
}

function logout(req, res) {
    req.session.destroy(err => {
        err ? res.status(500).json({ message: 'error' }) : res.status(200).json({ message: 'logged out' });
    });
}


function loginWithFacebook(req, res) {

}

function loginWithGoogle(req, res) {

}
