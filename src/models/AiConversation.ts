import mongoose, { Schema, Model } from 'mongoose';
import { IAIConversation } from '../types';

const aiConversationSchema = new Schema<IAIConversation>({
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
    messages: [{
        role: {
            type: String,
            enum: ['user', 'assistant'],
            required: true
        },
        content: {
            type: String,
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    context: {
        project: {
            type: Schema.Types.ObjectId,
            ref: 'Project'
        },
        task: {
            type: Schema.Types.ObjectId,
            ref: 'Task'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastMessageAt: {
        type: Date,
        default: Date.now
    }
});

// Update lastMessageAt when new message is added
aiConversationSchema.pre('save', function () {
    if (this.isModified('messages')) {
        this.lastMessageAt = new Date();
    }
});

const AIConversation: Model<IAIConversation> = mongoose.model<IAIConversation>('AIConversation', aiConversationSchema);

export default AIConversation; 