import nodemailer, { Transporter, SentMessageInfo } from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

interface EmailOptions {
    email: string;
    subject: string;
    message: string;
}

interface SmtpConfig {
    host: string;
    port: number;
    user: string;
    pass: string;
    fromName: string;
}

const getSmtpConfig = (): SmtpConfig => {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, FROM_NAME } = process.env;

    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !FROM_NAME) {
        throw new Error('Missing required SMTP environment variables');
    }

    return {
        host: SMTP_HOST,
        port: parseInt(SMTP_PORT, 10),
        user: SMTP_USER,
        pass: SMTP_PASS,
        fromName: FROM_NAME
    };
};

const sendEmail = async (options: EmailOptions): Promise<SentMessageInfo> => {
    const config = getSmtpConfig();

    const transporter: Transporter = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: false,
        auth: {
            user: config.user,
            pass: config.pass
        }
    });

    const mailOptions = {
        from: config.fromName,
        to: options.email,
        subject: options.subject,
        html: options.message
    };

    const info: SentMessageInfo = await transporter.sendMail(mailOptions);

    console.log('Email sent successfully!');
    console.log('Message ID:', info.messageId);

    return info;
};

export default sendEmail;