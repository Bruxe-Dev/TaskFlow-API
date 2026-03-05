import mongoose, { Schema, Model } from 'mongoose';
import { IWorkspace } from '../types';

const workspaceSchema = new Schema<IWorkspace>({
    team: {
        type: Schema.Types.ObjectId,
        ref: 'Team',
        required: true,
        unique: true // One workspace per team
    },
    name: {
        type: String,
        required: [true, 'Workspace name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    projects: [{
        type: Schema.Types.ObjectId,
        ref: 'Project'
    }],
    aiAssistantEnabled: {
        type: Boolean,
        default: true
    },
    aiConversations: [{
        type: Schema.Types.ObjectId,
        ref: 'AIConversation'
    }],
    settings: {
        allowFileSharing: {
            type: Boolean,
            default: true
        },
        notifyOnUpdates: {
            type: Boolean,
            default: true
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Workspace: Model<IWorkspace> = mongoose.model<IWorkspace>('Workspace', workspaceSchema);

export default Workspace;