import mongoose, { Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { IUser, UserRole } from '../types';

const userSchema = new Schema<IUser>({
    username: {
        type: String,
        required: [true, 'Please provide a username'],
        unique: true,
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
        required: [true, 'Please provide a password'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false
    },
    role: {
        type: String,
        enum: Object.values(UserRole),
        default: UserRole.MEMBER
    },
    organization: {
        type: Schema.Types.ObjectId,
        ref: 'Organization'
    },
    field: {
        type: Schema.Types.ObjectId,
        ref: 'Field'
    },
    teams: [{
        type: Schema.Types.ObjectId,
        ref: 'Team'
    }],
    permissions: {
        canCreateTeams: {
            type: Boolean,
            default: false
        },
        canAssignTasks: {
            type: Boolean,
            default: false
        },
        canReviewSubmissions: {
            type: Boolean,
            default: false
        }
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationToken: String,
    emailVerificationExpire: Date,
    profilePicture: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastActive: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getSignedJwtToken = function (): string {
    return jwt.sign(
        { id: this._id },
        process.env.JWT_SECRET as string,
        { expiresIn: process.env.JWT_EXPIRE }
    );
};

// Method to generate email verification token
userSchema.methods.getEmailVerificationToken = function (): string {
    const verificationToken = crypto.randomBytes(20).toString('hex');

    this.emailVerificationToken = crypto
        .createHash('sha256')
        .update(verificationToken)
        .digest('hex');

    this.emailVerificationExpire = new Date(Date.now() + 10 * 60 * 1000);

    return verificationToken;
};

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;