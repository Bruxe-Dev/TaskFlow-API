import {
    Model, Schema
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
    }
})