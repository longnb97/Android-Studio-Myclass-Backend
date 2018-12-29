const bcrypt = require('bcrypt'),
    saltRounds = 10;

const User = require('../models/user-model');

module.exports = {
    createAdminAccount,
    createUserAccount,
    updateTime,
    getAllSchedule,
    getSelfSchedule,
    // isExisted,
    updateTimee,
}

function createUserAccount(req, res) {
    const { displayName, password, cardNumber, email } = req.body;
    var hashPassword = bcrypt.hashSync(password, saltRounds);
    const info = { displayName, hashPassword, cardNumber, email };
    let newUser = new User(info);
    newUser.save()
        .then(user => res.send(user))
        .catch(err => res.send(err));
}

function updateTime(req, res) {
    let now = new Date();
    User.findById(req.query.id)
        .then(userfound => {
            if (!userfound) res.status(404).json({ user: userfound })
            else {
                if (userfound.status === ' ') {
                    // update checkOut time
                    let data = { checkIn: now, checkOut: 'null' };
                    userfound.appearance.push(data);
                    userfound.status = 'in';
                    return userfound.save();
                }
                else if (userfound.status === 'in') {
                    // update checkOut time
                    let lastIndex = userfound.appearance.length - 1;
                    userfound.appearance[lastIndex].checkOut = now;
                    userfound.status = 'out';
                    return userfound.save();
                }
                else if (userfound.status === 'out') {
                    // update checkIn time
                    let data = { checkIn: now, checkOut: null };
                    userfound.appearance.push(data);
                    userfound.status = 'in';
                    return userfound.save();
                }
                else res.status(400).json({ message: 'Bad request' });
            }
        })
        .then(updatedTime => res.status(200).json({ message: 'updated', updatedTime }))
        .catch(err => res.status(500).json(err));
}


function getSelfSchedule(req, res) {
    const id = req.params.id;
    User.findOne(id)
        .then(userFound => {
            if (!userFound) res.status(404).json({ message: "user not found" })
            else if (userFound && userFound.schedule) {
                let userSchedule = userFound.schedule;
                res.status(200).json({ message: "found", userSchedule });
            }
            else res.status(204).json({ message: "schedule empty" });
        })
        .catch(err => res.status(500).json(err));
}

function updateTimee(data) {
    console.log(data);
    let now = new Date();
    User.findOne({ cardNumber: data })
        .then(userfound => {
            if (!userfound) return 'not found'
            else {
                if (userfound.status === 'in') {
                    // update checkOut time
                    let lastIndex = userfound.appearance.length - 1;
                    userfound.appearance[lastIndex].checkOut = now;
                    userfound.status = 'out';
                    return userfound.save();
                }
                else if (userfound.status === 'out') {
                    // update checkIn time
                    let data = { checkIn: now, checkOut: null };
                    userfound.appearance.push(data);
                    userfound.status = 'in';
                    return userfound.save();
                }
                else res.status(400).json({ message: 'Bad request' });
            }
        })
        .then(updatedTime => {'updated', updatedTime })
        .catch(err => err );
}

//admin only
function getAllSchedule(req, res) {
    User.find()
        .select('avatarUrl appearance role email displayName cardNumber _id')
        .sort({ cardNumber: -1 }) //sort card number by descending order
        .then(userFound => {
            if (!userFound) res.status(404).json({ message: "Not Found" });
            else res.status(200).json({ message: "Users Found", userFound });
        })
        .catch(error => res.status(500).json(err));
}

function createAdminAccount(req, res) {
    const { displayName, password, cardNumber, email } = req.body;
    var hashPassword = bcrypt.hashSync(password, saltRounds);
    const info = { displayName, hashPassword, cardNumber, email, role:"admin" };
    let newUser = new User(info);
    newUser.save()
        .then(user => res.send(user))
        .catch(err => res.send(err));
}


// function isExisted(cardNumber) {
//     User.findOne({ cardNumber })
//         .then(userFound => {
//             if (userFound && userFound.cardNumber && userFound.email) return true;
//             else return false;
//         })
//         .catch(err => res.status(500).json(err));
// }