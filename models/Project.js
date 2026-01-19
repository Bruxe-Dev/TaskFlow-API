const { default: mongoose } = require('mongoose');
const Counter = require('./Counter');

const projectSchema = new mongoose.Schema({
    projectId: {
        type: Number,
        unique: true
    },
    name: {
        type: String,
        required: [true, 'Project is required'],
        trim: true,
        maxLength: [100, 'Projet name can not exceed 100 Characters'],
    },
    description: {
        type: String,
        trim: true,
        maxLength: [500, 'The projet description cannot exceed 500 characters']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

projectSchema.index({ projectId: 1, name: 1 }, { required: true });

//Auto incrementation of Id

projectSchema.pre('save', async function (next) {
    if (!this.isNew) return next();

    const counter = await Counter.findByIdAndUpdate(
        { _id: 'projectId' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true },
    );

    this.projectId = counter.seq;
});

module.exports = mongoose.model('Project', projectSchema);