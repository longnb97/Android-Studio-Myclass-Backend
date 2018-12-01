const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AccountSchema = new Schema({
    name: String,
    avatarUrl: { type: String, default: "default.img" },
    facebookId: { type: String },
    googleId: { type: String },
    facebookToken: { type: String },
    googleToken: { type: String },
    email: { type: String },
    accountId: { type: String }
}, { timestamps: true });

const ScheduleSchema = new Schema({

}, { timestamps: true })

module.exports = mongoose.model("user", AccountSchema);
