import mongoose, { Schema, Model } from 'mongoose';
import { ISubmission, SubmissionStatus } from '../types';

const submissionSchema = new Schema<ISubmission>({
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    submittedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    team: {
        type: Schema.Types.ObjectId,
        ref: 'Team',
        required: true
    },
    content: {
        type: String,
        required: [true, 'Submission content is required'],
        trim: true,
        maxlength: [5000, 'Content cannot exceed 5000 characters']
    },
    files: [{
        name: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        },
        size: {
            type: Number,
            required: true
        }
    }],
    status: {
        type: String,
        enum: Object.values(SubmissionStatus),
        default: SubmissionStatus.PENDING
    },
    reviewedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviewNotes: {
        type: String,
        trim: true,
        maxlength: [2000, 'Review notes cannot exceed 2000 characters']
    },
    reviewedAt: {
        type: Date
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }
});

const Submission: Model<ISubmission> = mongoose.model<ISubmission>('Submission', submissionSchema);

export default Submission;