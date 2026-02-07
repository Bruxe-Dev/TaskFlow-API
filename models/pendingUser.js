const { default: mongoose } = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { type } = require('os');
require('dotenv').config();

const pendingUserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email']
    },
    password: {
        type: String,
        required: true
    },
    emailVerificationToken: {
        type: String,
        required: true
    },
    emailVerificationExpire: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 600
    }
});

//Generate the verification token
pendingUserSchema.methods.getEmailVerificationToken = function () {
    const verificationToken = crypto.randomBytes(20).toString('hex');

    this.emailVerificationToken = crypto
        .createHash('sha256')
        .update(verificationToken)
        .digest('hex')

    this.emailVerificationExpire = Date.now() + 10 * 60 * 1000;

    return verificationToken;
};

module.exports = mongoose.model('PendingUser', pendingUserSchema);