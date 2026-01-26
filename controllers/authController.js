const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

exports.register = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    // Create user
    const user = await User.create({
        username,
        email,
        password
    });

    // Generate verification token
    const verificationToken = user.getEmailVerificationToken();
    await user.save();

    // Create verification URL
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

    // Email message
    const message = `
    <h1>Welcome to TaskFlow Lite!</h1>
    <p>Thank you for registering. Please verify your email by clicking the link below:</p>
    <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
    <p>Or copy this link: ${verificationUrl}</p>
    <p>This link will expire in 10 minutes.</p>
    <p>If you didn't create an account, please ignore this email.</p>
  `;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Email Verification - TaskFlow Lite',
            message
        });

        res.status(201).json({
            success: true,
            message: 'User registered. Please check your email to verify your account.',
            data: {
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        // If email fails, delete the user
        await user.deleteOne();

        return res.status(500).json({
            success: false,
            error: 'Email could not be sent. Please try again.'
        });
    }
});

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
// @access  Public
exports.verifyEmail = asyncHandler(async (req, res) => {
    // Hash the token from URL
    const emailVerificationToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    // Find user with this token and check if not expired
    const user = await User.findOne({
        emailVerificationToken,
        emailVerificationExpire: { $gt: Date.now() }
    });

    if (!user) {
        return res.status(400).json({
            success: false,
            error: 'Invalid or expired verification token'
        });
    }

    // Mark email as verified
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;
    await user.save();

    // Generate JWT token for automatic login
    const token = user.getSignedJwtToken();

    res.status(200).json({
        success: true,
        message: 'Email verified successfully! You are now logged in.',
        token,
        data: {
            id: user._id,
            username: user.username,
            email: user.email,
            isEmailVerified: user.isEmailVerified
        }
    });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            error: 'Please provide email and password'
        });
    }

    // Check for user (include password field)
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

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        data: user
    });
});

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
// @access  Public
exports.resendVerification = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

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

    // Create verification URL
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

    // Email message
    const message = `
    <h1>Email Verification</h1>
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