const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmail = async (options) => {
    try {
        // Create transporter
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        // Email options
        const mailOptions = {
            from: process.env.FROM_EMAIL,
            to: options.email,
            subject: options.subject,
            html: options.message
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);

        console.log('✅ Email sent successfully!');
        console.log('Message ID:', info.messageId);

        return info;
    } catch (error) {
        console.error('❌ Email Error:', error);
        throw new Error('Email could not be sent');
    }
};

module.exports = sendEmail;