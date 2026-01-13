const { default: mongoose } = require('mongoose');

const projectSchema = new mongoose.Schema({
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
})

module.exports = mongoose.model('Project', projectSchema);