const express = require('express');
const router = express.Router();
const User = require('../models/User');

const {
    register,
    verifyEmail,
    login,
    getMe,
    resendVerification
} = require('../controllers/authController');

const { protect } = require('../middleware/auth')

//Public Routes

router.post('./register', register);
router.get('/verify-email/:token', verifyEmail)
router.post('./login', login);
router.post('./resend-verification', resendVerification)

router.get('./me', protect, getMe)

module.exports = router;