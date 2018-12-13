const User = require('../models/user-model');

module.exports = {
    create,
    updateTime,
    getAll,
    updateTimee,
}

function create(req, res) {
    let newUser = new User(req.body);
    newUser.save()
        .then(user => res.send(user))
        .catch(err => res.send(err))
}

function updateTime(req, res) {
    let now = new Date();
    User.findOne({ cardNumber: req.params.cardNumber })
        .then(userfound => {
            if (!userfound) res.status(404).json({ user: userfound })
            else {
                if (userfound.status === 'in') {  //  [{ in out } ,{ in out }]
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
                else res.status(500).json({ message: 'error updating' })
            }
        })
        .then(updatedTime => res.status(200).json({message:'ok', updatedTime}))
        .catch(err => res.send(err))
}

function getAll(req, res){
    User.find()
    .then(userFound => res.send(userFound));
}

function updateTimee(data) {
    let now = new Date();
    User.findOne({ cardNumber: data })
        .then(userfound => {
            if (!userfound) res.status(404).json({ user: userfound })
            else {
                if (userfound.status === 'in') {  //  [{ in out } ,{ in out }]
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
                else res.status(500).json({ message: 'error updating' })
            }
        })
        .then(updatedTime => res.status(200).json({message:'ok', updatedTime}))
        .catch(err => res.send(err))
}