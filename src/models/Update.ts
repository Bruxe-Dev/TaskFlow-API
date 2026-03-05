import mongoose, { Schema, Model } from 'mongoose';
import { IUpdate } from '../types';

const updateSchema = new Schema<IUpdate>({
    workspace: {
        type: Schema.Types.ObjectId,
        ref: 'Workspace',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['progress', 'comment', 'milestone', 'blocker'],
        required: true
    },
    content: {
        type: String,
        required: [true, 'Update content is required'],
        trim: true,
        maxlength: [2000, 'Content cannot exceed 2000 characters']
    },
    relatedTo: {
        type: {
            type: String,
            enum: ['project', 'task']
        },
        id: {
            type: Schema.Types.ObjectId,
            refPath: 'relatedTo.type'
        }
    },
    mentions: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    attachments: [{
        url: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Update: Model<IUpdate> = mongoose.model<IUpdate>('Update', updateSchema);

export default Update;