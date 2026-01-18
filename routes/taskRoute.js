const express = require('express')
const router = express.Router();
const Task = require('../models/Task');
const Project = require('../models/Project');
const asyncHandler = require('../middleware/asyncHandlewrapp');

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
        const tasks = await Task.find().populate('project', 'name description');

        if (!tasks) {
            res.status(404).json({
                success: false,
                error: "No Tasks Available!"
            })
        }
        res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        })
    }
});

//Getting multiple tasks by the project id

router.get('/project/:projectId', async (req, res) => {
    try {
        const tasks = await Task.find({
            project: req.params.projectId
        }).populate('project', 'name description')

        res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        })
    }
});

router.get('/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate('project', 'name description');

        if (!task) {
            res.status(404).json({
                success: false,
                error: "No Task found"
            });
        }
        res.status(200).json({
            success: true,
            data: task
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

router.put('/:id', async (req, res) => {
    try {
        if (req.body.project) {
            const projectExists = await Project.findById(req.body.project);

            if (!projectExists) {
                return res.status(404).json({
                    success: false,
                    error: "Project Not found"
                });
            }
        }
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        ).populate('project', 'name description')

        if (!task) {
            res.status(404).json({
                success: false,
                error: "Task Not Found"
            })
        }
        res.status(200).json({
            success: true,
            data: task
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        })
    }
})

//To mark a task as complete or incomplete we will use the patch request

router.patch('/:id/complete', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            res.status(404).json({
                success: false,
                error: "Task Not Found"
            });
        }
        task.completed = !task.completed;
        await task.save();

        res.status(200).json({
            success: true,
            data: task
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        })
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            res.status(404).json({
                success: false,
                error: "Task Not Found"
            });
        }
        res.status(200).json({
            success: true,
            data: {},
            message: "Task Deleted Successfully"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        })
    }
});

//Get upcomming tasks in a week

router.get('/upcoming/week', asyncHandler(async (req, res) => {
    const now = new Date();
    const nextWeek = new Date();

    nextWeek.setDate(nextWeek.getDate() + 7);//Setting the date to one week

    const tasks = await Task.find({
        dueDate: {
            $gte: now,
            $lte: nextWeek
        },
        completed: false
    })
        .populate('project', 'name description')
        .sort({ dueDate: 1 });

    res.status(200).json({
        success: true,
        count: tasks.length,
        data: tasks
    })
}));

// Searching for tasks by title ?

router.get('/search', asyncHandler(async (req, res) => {
    const { q } = req.query

    if (!q) {
        res.status(400).json({
            succees: false,
            error: "No Task Title provided"
        })
    }
    const task = await Task.find({
        title: {
            $regex: q,
            $options: 'i'
        }
    })
        .populate('project', 'name description')
        .sort({ createdAt: -1 })

    res.status(200).json({
        succees: true,
        searchTerm: q,
        data: task
    })
}));

// BULK complete tasks for a project
router.patch('/project/:projectId/complete-all', asyncHandler(async (req, res) => {
    const result = await Task.updateMany(
        {
            project: req.params.projectId,
            completed: false
        },
        {
            completed: true
        }
    );

    res.status(200).json({
        success: true,
        message: `Marked ${result.modifiedCount} tasks as complete`,
        modifiedCount: result.modifiedCount
    });
}));

// GET overdue tasks
router.get('/overdue/list', asyncHandler(async (req, res) => {
    // Get current date and time
    const now = new Date();

    const tasks = await Task.find({
        dueDate: { $lt: now },
        completed: false
    })
        .populate('project', 'name description')
        .sort({ dueDate: 1 });  // Sort by due date (oldest first)

    res.status(200).json({
        success: true,
        count: tasks.length,
        data: tasks
    });
}));
module.exports = router;