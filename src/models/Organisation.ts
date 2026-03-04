import mongoose, { Model, Schema } from 'mongoose'
import { IOrganisation } from '../types'
import { IntervalHistogram } from 'node:perf_hooks';

const orgnaisationSchema = new Schema<IOrganisation>({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        maxLength: [50, 'Organisation name cannot exceed 50 chars']
    },
    description: {
        type: String,
        trim: true,
        maxLength: [500, 'Description not ot exceed 500 characters']
    },
    industry: {
        type: String,
        trim: true
    },
    leader: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    maxAdmins: {
        type: Number,
        default: 6,
        max: [6, 'Cannot exceed 6 admins']
    },
    activeAdmins: {
        type: Number,
        default: 0
    },
    fields: [{
        type: Schema.Types.ObjectId,
        ref: 'Field',
        required: true
    }],
    settings: {
        allowedFieldAccess: {
            type: Boolean,
            default: true
        },
        requireAccessRequestApproval: {
            type: Boolean,
            default: true
        },
        aiEnabled: {
            type: Boolean,
            default: true
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

orgnaisationSchema.pre('save', async function (next) {
    this.updatedAt = new Date();
    next();
})

const Organisation: Model<IOrganisation> = mongoose.model<IOrganisation>('Organisation', orgnaisationSchema)
export default Organisation;