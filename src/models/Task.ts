import mongoose, { Schema, Model } from 'mongoose';
import { ITask, TaskStatus, Priority } from '../types';

const taskSchema = new Schema<ITask>({
    name: {
        type: String,
        required: [true, 'Task title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    assignedTo: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    assignedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: Object.values(TaskStatus),
        default: TaskStatus.TODO
    },
    priority: {
        type: String,
        enum: Object.values(Priority),
        default: Priority.MEDIUM
    },
    dueDate: {
        type: Date
    },
    dependencies: [{
        type: Schema.Types.ObjectId,
        ref: 'Task'
    }],
    attachments: [{
        name: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        },
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    completedAt: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Set completedAt when status changes to completed
taskSchema.pre('save', function () {
    if (this.status === TaskStatus.COMPLETED && !this.completedAt) {
        this.completedAt = new Date();
    }

    // Clear completedAt if status changes from completed
    if (this.status !== TaskStatus.COMPLETED && this.completedAt) {
        this.completedAt = undefined;
    }
});

const Task: Model<ITask> = mongoose.model<ITask>('Task', taskSchema);

export default Task;