import mongoose, { Schema, Model } from 'mongoose';
import { IAccessRequest, AccessStatus } from '../types';

const accessRequestSchema = new Schema<IAccessRequest>({
    requester: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    targetField: {
        type: Schema.Types.ObjectId,
        ref: 'Field',
        required: true
    },
    targetWorkspace: {
        type: Schema.Types.ObjectId,
        ref: 'Workspace'
    },
    reason: {
        type: String,
        required: [true, 'Reason for access request is required'],
        trim: true,
        minlength: [20, 'Reason must be at least 20 characters'],
        maxlength: [500, 'Reason cannot exceed 500 characters']
    },
    status: {
        type: String,
        enum: Object.values(AccessRequestStatus),
        default: AccessRequestStatus.PENDING
    },
    approvedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    approvalNotes: {
        type: String,
        trim: true,
        maxlength: [500, 'Approval notes cannot exceed 500 characters']
    },
    expiresAt: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    processedAt: {
        type: Date
    }
});

// Set processedAt when status changes from pending
accessRequestSchema.pre('save', function () {
    if (this.isModified('status') && this.status !== AccessRequestStatus.PENDING && !this.processedAt) {
        this.processedAt = new Date();
    }
});

const AccessRequest: Model<IAccessRequest> = mongoose.model<IAccessRequest>('AccessRequest', accessRequestSchema);

export default AccessRequest;