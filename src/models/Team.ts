import mongoose, { Model, Schema } from 'mongoose'
import { ITeam } from '../types'

const teamSchema = new Schema<ITeam>({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    field: {
        type: Schema.Types.ObjectId,
        ref: 'Field',
        required: true
    },
    organization: {
        type: Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    },
    members: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        role: {
            type: String,
            enum: ['lead', 'member'],
            default: 'member'
        },
        joinedAt: {
            type: Date,
            default: Date.now
        }
    }],
    workspace: {
        type: Schema.Types.ObjectId,
        ref: 'Workspace'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Prevent duplicate members
teamSchema.index({ 'members.user': 1 }, { unique: true, sparse: true });

const Team: Model<ITeam> = mongoose.model<ITeam>('Team', teamSchema);

export default Team;