const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
// const session = require('express-session');

const User = require('../models/user-model');
const TokenHelper = require('../helpers/token-helpers');

module.exports = router;

router.post('/login', login);
router.get('/logout', logout);
router.post('/fbLogin', loginWithFacebook);
router.post('/googleLogin', loginWithGoogle);

// router.get('/session', (req, res) => {
//     console.log(req.session.user)
//     const data = req.session.user;
//     res.json({message:"done", data });
// });

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
                        const { _id, email, displayName, cardNumber } = userFound;
                        const userInfo = { _id, email, displayName, cardNumber };
                        let token = TokenHelper.generateToken(userInfo);

                        // req.session.user = {
                        //     email,
                        //     role: userFound.role,
                        //     token
                        // };
                        // req.session.save();

                        res.status(200).json({ success: 1, message: 'logging in, navigate to app front page', token, userFound });
                    }
                }
            }
        })
        .catch(err => res.status(500).send(err))
}

function logout(req, res) {
    res.status(200).json({ message: "tu di ma remove data trong local Storage" })
}


function loginWithFacebook(req, res) {

}

function loginWithGoogle(req, res) {

}
