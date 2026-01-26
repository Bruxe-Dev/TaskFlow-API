const express = require('express');
const router = express.Router();
const User = require('../models/User');

const {
    register,
    verifyEmail,
    login,
    getMe,
    resendVelification
} = require('../controllers/authController')