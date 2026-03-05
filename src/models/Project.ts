import mongoose, { Schema, Model } from 'mongoose';
import { IProject, ProjectStatus, Priority } from '../types';

const projectSchema = new Schema<IProject>({
    name: {
        type: String,
        required: [true, 'Project title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    workspace: {
        type: Schema.Types.ObjectId,
        ref: 'Workspace',
        required: true
    },
    team: {
        type: Schema.Types.ObjectId,
        ref: 'Team',
        required: true
    },
    assignedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: Object.values(ProjectStatus),
        default: ProjectStatus.PENDING
    },
    priority: {
        type: String,
        enum: Object.values(Priority),
        default: Priority.MEDIUM
    },
    deadline: {
        type: Date
    },
    tasks: [{
        type: Schema.Types.ObjectId,
        ref: 'Task'
    }],
    submissions: [{
        type: Schema.Types.ObjectId,
        ref: 'Submission'
    }],
    progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update timestamp on save
projectSchema.pre('save', function () {
    this.updatedAt = new Date();
});

// Auto-update status based on deadline
projectSchema.pre('save', function () {
    if (this.deadline && this.deadline < new Date() && this.status !== ProjectStatus.COMPLETED) {
        this.status = ProjectStatus.OVERDUE;
    }
});

const Project: Model<IProject> = mongoose.model<IProject>('Project', projectSchema);

export default Project;