const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt-nodejs');

const User = require('../models/user-model');
const TokenHelper = require('../helpers/token-helpers');

module.exports = router;

router.post('/login', login);
router.post('/fbLogin', loginWithFacebook);
router.post('/googleLogin', loginWithGoogle);

function login(req, res) {
    const { email, password } = req.body;
    ;
    User.findOne({ email: email })
        .then(userFound => {
            if (!userFound) res.status(404).json({ success: 0, message: 'user not found, navigate to register route' });
            else {
                if (userFound.hashPassword) {
                    let compare = bcrypt.compareSync(password, userFound.hashPassword);
                    if (!compare) res.status(400).json({ success: 0, message: 'wrong password' })
                    else {
                        const { email, displayName, cardNumber } = userFound;
                        const userInfo = { email, displayName, cardNumber };
                        let token = TokenHelper.generateToken(userInfo);
                        res.status(200).json({ success: 1, message: 'logging in, navigate to app front page', token, userFound })
                    }
                }
            }
        })
        .catch(err => res.status(500).send(err));
}

function loginWithFacebook(req, res) {

}

function loginWithGoogle(req, res) {

}
