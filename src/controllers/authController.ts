import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import User from '../models/User';
import PendingUser from '../models/PendingUser';
import sendEmail from '../utils/sendEmail';
import asyncHandleWrapper from '../middleware/asyncHandlewrapp';

declare global {
    namespace Express {
        interface Request {
            user?: typeof User.prototype;
        }
    }
}

// ─── Register ────────────────────────────────────────────────────────────────

export const register = asyncHandleWrapper(async (req: Request, res: Response, next: NextFunction): Promise<void> => {  // ✅ Bug 1 fixed
    const { username, email, password } = req.body;

    console.log('CLIENT_URL:', process.env.CLIENT_URL);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        res.status(400).json({ success: false, error: 'User with this email already exists' });
        return;
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
        res.status(400).json({ success: false, error: 'Username is already taken' });
        return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await PendingUser.deleteMany({ email });

    const pendingUser = new PendingUser({ username, email, password: hashedPassword });

    const verificationToken = pendingUser.getEmailVerificationToken();
    await pendingUser.save();

    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;
    console.log('Verification URL:', verificationUrl);

    const message = `
        <h1>Welcome to TaskFlow Lite!</h1>
        <p>Thank you for registering. Please verify your email by clicking the link below:</p>
        <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
        <p>Or copy this link: ${verificationUrl}</p>
        <p>This link will expire in 10 minutes.</p>
        <p>If you didn't create an account, please ignore this email.</p>
    `;

    try {
        await sendEmail({ email: pendingUser.email, subject: 'Email Verification - TaskFlow Lite', message });

        res.status(201).json({
            success: true,
            message: 'Registration initiated. Please check your email to verify your account within 10 minutes.',
            data: { username: pendingUser.username, email: pendingUser.email }
        });
    } catch (error) {
        await pendingUser.deleteOne();
        console.error('Email send error:', error);
        res.status(500).json({ success: false, error: 'Email could not be sent. Please try again.' });
    }
});

// ─── Verify Email ─────────────────────────────────────────────────────────────

export const verifyEmail = asyncHandleWrapper(async (req: Request, res: Response, next: NextFunction): Promise<void> => {  // ✅ Bug 1 fixed
    console.log('Verify email called with token:', req.params.token);

    const { token: verificationToken } = req.params;  // ✅ Bug 2 fixed — renamed to avoid conflict with JWT token below

    // ✅ Bug 3 fixed — validate token is a plain string not an array
    if (!verificationToken || Array.isArray(verificationToken)) {
        res.status(400).json({ success: false, error: 'Verification token is missing or invalid' });
        return;
    }

    const emailVerificationToken = crypto
        .createHash('sha256')
        .update(verificationToken)
        .digest('hex');

    console.log('Hashed token:', emailVerificationToken);

    const pendingUser = await PendingUser.findOne({
        emailVerificationToken,
        emailVerificationExpire: { $gt: Date.now() }
    });

    console.log('Pending user found:', pendingUser ? 'Yes' : 'No');

    if (!pendingUser) {
        res.status(400).json({
            success: false,
            error: 'Invalid or expired verification token. Please register again.'
        });
        return;
    }

    const user = await User.create({
        username: pendingUser.username,
        email: pendingUser.email,
        password: pendingUser.password,
        isEmailVerified: true
    });

    console.log('User created:', user._id);

    await pendingUser.deleteOne();
    console.log('Pending user deleted');

    const token = user.getSignedJwtToken();

    res.status(200).json({
        success: true,
        message: 'Email verified successfully! Your account has been created and you are now logged in.',
        token,
        data: {
            id: user._id,
            username: user.username,
            email: user.email,
            isEmailVerified: user.isEmailVerified
        }
    });
});

// ─── Login ────────────────────────────────────────────────────────────────────

export const login = asyncHandleWrapper(async (req: Request, res: Response, next: NextFunction): Promise<void> => {  // ✅ Bug 1 fixed
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ success: false, error: 'Please provide email and password' });
        return;
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        res.status(401).json({ success: false, error: 'Invalid credentials' });
        return;
    }

    if (!user.isEmailVerified) {
        res.status(401).json({ success: false, error: 'Please verify your email before logging in' });
        return;
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        res.status(401).json({ success: false, error: 'Invalid credentials' });
        return;
    }

    const token = user.getSignedJwtToken();

    res.status(200).json({
        success: true,
        token,
        data: {
            id: user._id,
            username: user.username,
            email: user.email,
            isEmailVerified: user.isEmailVerified
        }
    });
});

// ─── Get Me ───────────────────────────────────────────────────────────────────

export const getMe = asyncHandleWrapper(async (req: Request, res: Response, next: NextFunction): Promise<void> => {  // ✅ Bug 1 fixed
    const user = await User.findById(req.user?.id);

    res.status(200).json({ success: true, data: user });
});

// ─── Resend Verification ──────────────────────────────────────────────────────

export const resendVerification = asyncHandleWrapper(async (req: Request, res: Response, next: NextFunction): Promise<void> => {  // ✅ Bug 1 fixed
    const { email } = req.body;

    const pendingUser = await PendingUser.findOne({ email });

    if (!pendingUser) {
        res.status(404).json({ success: false, error: 'No pending registration found with that email' });
        return;
    }

    const verificationToken = pendingUser.getEmailVerificationToken();
    await pendingUser.save();

    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

    const message = `
        <h1>Email Verification</h1>
        <p>Please verify your email by clicking the link below:</p>
        <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
        <p>Or copy this link: ${verificationUrl}</p>
        <p>This link will expire in 10 minutes.</p>
    `;

    await sendEmail({ email: pendingUser.email, subject: 'Email Verification - TaskFlow Lite', message });

    res.status(200).json({ success: true, message: 'Verification email sent' });
});