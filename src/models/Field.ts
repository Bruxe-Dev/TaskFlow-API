import mongoose, { Model, Schema, Types } from 'mongoose'
import { IField } from '../types'
import { settings } from 'node:cluster'

const fieldSchema = new Schema<IField>({
    name: {
        type: String,
        required: true,
        trim: true,
        maxLength: [30, 'Field Length can not be greater than 30 Chars']
    },
    description: {
        type: String,
        maxLength: [500, 'Description must not be more than 500 characters'],
        trim: true
    },
    organization: {
        type: Schema.Types.ObjectId,
        ref: 'Organisation',
        required: true
    },
    admin: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        trim: true
    },
    teams: [{
        type: Schema.Types.ObjectId,
        ref: 'Team',
        required: true
    }], sharedWithAdmins: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    color: {
        type: String,
        default: '#3B82F6' // Default blue
    },
    icon: {
        type: String,
        default: 'folder'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Field: Model<IField> = mongoose.model<IField>('Field', fieldSchema);

export default Field;