require('dotenv').config();
const User = require('../models/User');
const PendingUser = require('../models/pendingUser');
const asyncHandler = require('../middleware/asyncHandlewrapp');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const pendingUser = require('../models/pendingUser');

exports.register = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    console.log('CLIENT_URL:', process.env.CLIENT_URL);
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({
            success: false,
            error: 'User with this email already exists'
        });
    }

    // Check if username is taken
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
        return res.status(400).json({
            success: false,
            error: 'Username is already taken'
        });
    }

    // Hash password manually before storing in PendingUser
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Delete any existing pending user with this email
    await PendingUser.deleteMany({ email });

    const pendingUser = new PendingUser({
        username,
        email,
        password: hashedPassword
    });

    const verificationToken = pendingUser.getEmailVerificationToken(); // This is synchronous, no await needed

    await pendingUser.save();

    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

    console.log(' Verification URL:', verificationUrl);
    const message = `
    <h1>Welcome to TaskFlow Lite!</h1>
    <p>Thank you for registering. Please verify your email by clicking the link below:</p>
    <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; transition: translateY(-2px)">Verify Email</a>
    <p>Or copy this link: ${verificationUrl}</p>
    <p>This link will expire in 10 minutes.</p>
    <p>If you didn't create an account, please ignore this email.</p>
  `;

    try {
        await sendEmail({
            email: pendingUser.email,
            subject: 'Email Verification - TaskFlow Lite',
            message
        });

        res.status(201).json({
            success: true,
            message: 'Registration initiated. Please check your email to verify your account within 10 minutes.',
            data: {
                username: pendingUser.username,
                email: pendingUser.email
            }
        });
    } catch (error) {
        // If email fails, delete the pending user
        await pendingUser.deleteOne();

        console.error('Email send error:', error); // Add this for debugging

        return res.status(500).json({
            success: false,
            error: 'Email could not be sent. Please try again.'
        });
    }
});

exports.verifyEmail = asyncHandler(async (req, res) => {
    console.log(' Verify email called with token:', req.params.token);

    // Hash the token from URL
    const emailVerificationToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    console.log(' Hashed token:', emailVerificationToken);

    // Find pending user with this token and check if not expired
    const pendingUser = await PendingUser.findOne({
        emailVerificationToken,
        emailVerificationExpire: { $gt: Date.now() }
    });

    console.log(' Pending user found:', pendingUser ? 'Yes' : 'No');

    if (!pendingUser) {
        return res.status(400).json({
            success: false,
            error: 'Invalid or expired verification token. Please register again.'
        });
    }

    console.log(' Creating actual user...');

    // Create actual user in User collection
    const user = await User.create({
        username: pendingUser.username,
        email: pendingUser.email,
        password: pendingUser.password, // Already hashed
        isEmailVerified: true
    });

    console.log(' User created:', user._id);

    // Delete pending user
    await pendingUser.deleteOne();
    console.log(' Pending user deleted');

    // Generate JWT token for automatic login
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


exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            error: 'Please provide email and password'
        });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return res.status(401).json({
            success: false,
            error: 'Invalid credentials'
        });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
        return res.status(401).json({
            success: false,
            error: 'Please verify your email before logging in'
        });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return res.status(401).json({
            success: false,
            error: 'Invalid credentials'
        });
    }

    // Create token
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

exports.getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        data: user
    });
});


exports.resendVerification = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await pendingUser.findOne({ email });

    if (!user) {
        return res.status(404).json({
            success: false,
            error: 'No user found with that email'
        });
    }

    if (user.isEmailVerified) {
        return res.status(400).json({
            success: false,
            error: 'Email is already verified'
        });
    }

    // Generate new verification token
    const verificationToken = user.getEmailVerificationToken();
    await user.save();


    const verificationUrl = `${process.env.CLIENT_URL} /verify-email/${verificationToken} `;

    // Email message
    const message = `
    < h1 > Email Verification</h1 >
    <p>Please verify your email by clicking the link below:</p>
    <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
    <p>Or copy this link: ${verificationUrl}</p>
    <p>This link will expire in 10 minutes.</p>
`;

    await sendEmail({
        email: user.email,
        subject: 'Email Verification - TaskFlow Lite',
        message
    });

    res.status(200).json({
        success: true,
        message: 'Verification email sent'
    });
});