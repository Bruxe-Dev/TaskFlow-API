import mongoose, { Schema, Model } from 'mongoose';
import { IProblemReport, ProblemCategory, ProblemSeverity, ProblemStatus } from '../types';

const problemReportSchema = new Schema<IProblemReport>({
    reportedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    team: {
        type: Schema.Types.ObjectId,
        ref: 'Team',
        required: true
    },
    category: {
        type: String,
        enum: Object.values(ProblemCategory),
        required: true
    },
    title: {
        type: String,
        required: [true, 'Problem title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
        type: String,
        required: [true, 'Problem description is required'],
        trim: true,
        maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    severity: {
        type: String,
        enum: Object.values(ProblemSeverity),
        default: ProblemSeverity.MEDIUM
    },
    status: {
        type: String,
        enum: Object.values(ProblemStatus),
        default: ProblemStatus.OPEN
    },
    assignedTo: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    resolution: {
        type: String,
        trim: true,
        maxlength: [2000, 'Resolution cannot exceed 2000 characters']
    },
    attachments: [{
        url: {
            type: String,
            required: true
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    resolvedAt: {
        type: Date
    }
});

// Set resolvedAt when status changes to resolved
problemReportSchema.pre('save', function () {
    if (this.status === ProblemStatus.RESOLVED && !this.resolvedAt) {
        this.resolvedAt = new Date();
    }
});

const ProblemReport: Model<IProblemReport> = mongoose.model<IProblemReport>('ProblemReport', problemReportSchema);

export default ProblemReport;