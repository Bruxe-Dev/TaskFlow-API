import { IPendingUser } from "../types";
import crypto from 'crypto';
import mongoose, { Schema, Model } from 'mongoose'
const pendingUserSchema = new Schema<IPendingUser>({
    username: {
        type: String,
        required: [true, 'Please provide a username'],
        trim: true,
        minlength: [3, 'Username must be at least 3 characters'],
        maxlength: [30, 'Username cannot exceed 30 characters']
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please provide a password']
    },
    emailVerificationToken: {
        type: String,
        required: true
    },
    emailVerificationExpire: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 600  // ✅ Auto-deletes document after 10 minutes (MongoDB TTL index)
    }
});

// ─── Method: Generate Verification Token ─────────────────────────────────────

pendingUserSchema.methods.getEmailVerificationToken = function (): string {
    const verificationToken = crypto.randomBytes(20).toString('hex');

    this.emailVerificationToken = crypto
        .createHash('sha256')
        .update(verificationToken)
        .digest('hex');

    this.emailVerificationExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    return verificationToken; // Return raw token (sent in email), store hashed
};

// ─── Model ────────────────────────────────────────────────────────────────────

const PendingUser: Model<IPendingUser> = mongoose.model<IPendingUser>('PendingUser', pendingUserSchema);

export default PendingUser;