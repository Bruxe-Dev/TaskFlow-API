const express = require('express')
const router = express.Router();
const Task = require('../models/Task');
const Project = require('../models/Project')

router.post('/', async (req, res) => {
    try {
        const { title, description, dueDate, project } = req.body;

        const projectExist = await Project.findById(project);
        if (!projectExist) {
            return res.status(404).json({
                success: false,
                error: "Project Not found"
            })
        }
        const task = new Task({
            title,
            description,
            dueDate,
            project,
        });

        await task.save();

        res.status(200).json({
            success: true,
            data: task
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

router.get('/', async (req, res) => {
    try {
        const tasks = await Project.find().populate('project', 'name description');

        if (!tasks) {
            res.status(404).json({
                success: false,
                error: "No Tasks Available!"
            })
        }
        res.status(200).json({
            success: true,
            count: tasks.lenght,
            data: tasks
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        })
    }
});

router.get('/project/:projectId', async (req, res) => {
    try {
        const tasks = await Task.find({
            project: req.params.projectId
        }).populate('project', 'name description')

        res.status(200).json({})
    } catch (error) {

    }
})