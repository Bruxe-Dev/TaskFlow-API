import express, { Router } from 'express'
import User from '../models/User'

import {
    register,
    verifyEmail,
    login,
    getMe,
    resendVerification
} from '../controllers/authController';

import { protect } from '../middleware/auth'

//Public Routes

router.post('/register', register);
router.get('/verify-email/:token', verifyEmail)
router.post('/login', login);
router.post('/resend-verification', resendVerification)

router.get('/me', protect, getMe)

export default router