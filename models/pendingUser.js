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
    }
})