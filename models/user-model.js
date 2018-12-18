const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AccountSchema = new Schema({
    displayName: String,
    hashPassword: String,
    avatarUrl: { type: String, default: "default.img" },
    cardNumber: { type: Number, unique: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    email: { type: String, unique: true },
    appearance: [{
        checkIn: { type: Date },
        checkOut: { type: Date },
    }],
    status: { type: String, enum: ['in', 'out', ' '], default: ' ' }
}, {
        timestamps: false
    });

module.exports = mongoose.model("user", AccountSchema);
