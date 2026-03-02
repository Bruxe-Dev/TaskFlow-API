const express = require('express');
const router = express.Router();
const Project = require('../models/Project.js')
const asyncHandler = require('../middleware/asyncHandlewrapp')


//Create a new project

router.post('/', async (req, res) => {
    try {
        const { name, description } = req.body
        const exist = await Project.findOne({ name })

        if (exist) {
            return res.status(400).json({
                success: false,
                message: "Project already exists"
            })
        }
        const project = new Project({
            name,
            description
        });

        await project.save()

        res.status(201).json({
            success: true,
            data: project
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            data: error.message
        });
    }
});

//Get all current Projects

router.get('/', async (req, res) => {
    try {
        const projects = await Project.find();

        res.status(200).json({
            success: true,
            count: projects.length,
            data: projects
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// GET project statistics
router.get('/:id/stats', asyncHandler(async (req, res) => {
    const Task = require('../models/Task');

    const project = await Project.findById(req.params.id);

    if (!project) {
        return res.status(404).json({
            success: false,
            error: 'Project not found'
        });
    }

    const totalTasks = await Task.countDocuments({ project: req.params.id });

    const completedTasks = await Task.countDocuments({
        project: req.params.id,
        completed: true
    });

    const pendingTasks = totalTasks - completedTasks;

    const now = new Date();
    const overdueTasks = await Task.countDocuments({
        project: req.params.id,
        dueDate: { $lt: now },
        completed: false
    });

    // Calculate completion percentage
    const completionPercentage = totalTasks > 0
        ? Math.round((completedTasks / totalTasks) * 100)
        : 0;

    res.status(200).json({
        success: true,
        data: {
            project: {
                _id: project._id,
                name: project.name,
                description: project.description
            },
            stats: {
                totalTasks,
                completedTasks,
                pendingTasks,
                overdueTasks,
                completionPercentage: `${completionPercentage}%`
            }
        }
    });
}));

//Getting only one project

router.get('/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                success: false,
                error: "Project not found"
            });
        }
        res.status(200).json({
            sucess: true,
            data: project
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Updating a Project

router.put('/:id', async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true, //Returns the updated Document
                runValidators: true //Makes sure that schema rules are cvalidated
            }
        );
        if (!project) {
            return res.status(404).json({
                success: false,
                error: 'Project not found'
            })
        }
        res.status(200).json({
            success: true,
            data: project
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

//Delete a Project

router.delete('/:id', async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);

        if (!project) {
            return res.status(404).json({
                success: false,
                error: 'No Project found'
            })
        }
        res.status(200).json({
            success: true,
            data: {},
            message: 'Project deleted Successfully'
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        })
    }
})

//Get a project with all its assigned tasks

router.get('/:id/tasks', asyncHandler(async (req, res) => {
    const Task = require('../models/Task');
    const project = await Project.findById(req.params.id);

    if (!project) {
        return res.status(404).json({
            success: false,
            error: "Project Not Found"
        });
    }
    const tasks = await Task.find({ project: req.params.id })
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        data: {
            project,
            tasks,
            taskCount: tasks.length
        }
    });
}))

module.exports = router;
