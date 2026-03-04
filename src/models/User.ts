import {
    Model, Schema,
    Types
} from "mongoose";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { IUser, UserRole } from '../types/index'

const userSchema = new Schema<IUser>({
    username: {
        type: String,
        required: [true, 'Please enter a username'],
        trim: true,
        unique: true,
        minLength: [4, 'Username must ne 6 Chars min'],
        maxLength: [8, 'Username must not overceed 8Chars']
    },
    email: {
        type: String,
        required: [true, 'Please enter you email'],
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email'],
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'Please a password'],
        unique: true,
        select: false,
        minLength: [6, 'Password must be 6 chars minimum']
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
})