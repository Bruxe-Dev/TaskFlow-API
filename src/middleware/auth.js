const jwt = require('jsonwebtoken');
const asyncHandler = require('./asyncHandlewrapp');
const User = require('../models/User');
require('dotenv').config();

exports.protect = asyncHandler(async (req, res) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            error: "No Authorisation"
        });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //Get the user from the Token
        req.user = await User.findById(decoded.id)

        if (!req.user) {
            return res.status(404).json({
                success: false,
                error: 'User Not Found'
            });
        }

        if (!req.user.isEmailVerified) {
            return res.status(403).json({
                success: false,
                error: 'Please Verify Your Email To Continue'
            })
        }

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            error: 'NO AUTHORISATION TO ACCES THIS ROUTE'
        })
    }
})