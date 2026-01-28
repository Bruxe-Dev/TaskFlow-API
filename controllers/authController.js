const User = require('../models/User');
const PendingUser = require('../models/pendingUser');
const asyncHandler = require('../middleware/asyncHandlewrapp');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

exports.register = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

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

    // Create pending user
    const pendingUser = await PendingUser.create({
        username,
        email,
        password: hashedPassword
    });

    // Generate verification token
    const verificationToken = pendingUser.getEmailVerificationToken();
    await pendingUser.save();

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

        return res.status(500).json({
            success: false,
            error: 'Email could not be sent. Please try again.'
        });
    }
});