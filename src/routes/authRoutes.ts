import express, { Router } from 'express'
import User from '../models/User'

import {
    register,
    verifyEmail,
    login,
    getMe,
    resendVerification,
    update_profile
} from '../controllers/authController';

import protect from '../middleware/auth'
const router: Router = express.Router()
//Public Routes

router.post('/register', register);
router.get('/verify-email/:token', verifyEmail);
router.post('/login', login);
router.post('/resend-verification', resendVerification);
router.put('/update-profile', protect, update_profile)

router.get('/me', protect, getMe)

export default router