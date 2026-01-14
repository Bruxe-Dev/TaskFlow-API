const { default: mongoose } = require('mongoose')
const Counter = require('./Counter')

const taskSchema = new mongoose.Schema({
    taskId: {
        type: Number,
        unique: true
    },
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

//Auto incrementaion of ID
taskSchema.pre('save', async () => {
    if (!this.isNew) return next();

    const counter = await Counter.findByIdAndUpdate(
        { _id: 'taskId' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );

    this.taskId = counter.seq;
    next()
})
const counter =

    module.exports = mongoose.model('Task', taskSchema);