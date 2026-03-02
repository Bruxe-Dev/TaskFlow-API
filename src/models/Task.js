const { default: mongoose } = require('mongoose')
const Counter = require('./Counter')

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Task title is required'],
        trim: true,
        maxLength: [100, 'Task title must not be more than 100 Characters']
    },
    description: {
        type: String,
        trim: true,
        maxLength: [500, 'Description not to be over 500 Characters']
    },
    dueDate: {
        type: Date,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: [true, 'Task must belong to a project']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Task', taskSchema);