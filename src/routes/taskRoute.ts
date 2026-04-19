import express, { Router, Request, Response, NextFunction } from 'express';
import Task from '../models/Task';
import Project from '../models/Project';
import asyncHandleWrapper from '../middleware/asyncHandlewrapp';

const router: Router = express.Router();

// ─── Create a Task ───────────────────────────────────────────────────────────

router.post('/', asyncHandleWrapper(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { title, description, dueDate, project } = req.body;

    const projectExists = await Project.findById(project);
    if (!projectExists) {
        res.status(404).json({
            success: false,
            error: 'Project not found'
        });
        return;
    }

    const task = new Task({ title, description, dueDate, project });
    await task.save();

    res.status(201).json({
        success: true,
        data: task
    });
}));

// ─── Get All Tasks ───────────────────────────────────────────────────────────

router.get('/', asyncHandleWrapper(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const tasks = await Task.find().populate('project', 'name description');

    res.status(200).json({
        success: true,
        count: tasks.length,
        data: tasks
    });
}));

// ─── Search Tasks by Title ───────────────────────────────────────────────────

router.get('/search', asyncHandleWrapper(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { q } = req.query;

    if (!q) {
        res.status(400).json({
            success: false,
            error: 'No search term provided'
        });
        return;
    }

    const tasks = await Task.find({
        title: { $regex: q, $options: 'i' }
    })
        .populate('project', 'name description')
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        searchTerm: q,
        data: tasks
    });
}));

// ─── Get Upcoming Tasks (Next 7 Days) ────────────────────────────────────────

router.get('/upcoming/week', asyncHandleWrapper(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    const tasks = await Task.find({
        dueDate: { $gte: now, $lte: nextWeek },
        completed: false
    })
        .populate('project', 'name description')
        .sort({ dueDate: 1 });

    res.status(200).json({
        success: true,
        count: tasks.length,
        data: tasks
    });
}));

// ─── Get Overdue Tasks ───────────────────────────────────────────────────────

router.get('/overdue/list', asyncHandleWrapper(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const now = new Date();

    const tasks = await Task.find({
        dueDate: { $lt: now },
        completed: false
    })
        .populate('project', 'name description')
        .sort({ dueDate: 1 });

    res.status(200).json({
        success: true,
        count: tasks.length,
        data: tasks
    });
}));

// ─── Get Tasks by Project ────────────────────────────────────────────────────

router.get('/project/:projectId', asyncHandleWrapper(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const tasks = await Task.find({ project: req.params.projectId })
        .populate('project', 'name description');

    res.status(200).json({
        success: true,
        count: tasks.length,
        data: tasks
    });
}));

// ─── Bulk Complete All Tasks in a Project ────────────────────────────────────

router.patch('/project/:projectId/complete-all', asyncHandleWrapper(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const result = await Task.updateMany(
        { project: req.params.projectId, completed: false },
        { completed: true }
    );

    res.status(200).json({
        success: true,
        message: `Marked ${result.modifiedCount} tasks as complete`,
        modifiedCount: result.modifiedCount
    });
}));

// ─── Get One Task ────────────────────────────────────────────────────────────

router.get('/:id', asyncHandleWrapper(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const task = await Task.findById(req.params.id).populate('project', 'name description');

    if (!task) {
        res.status(404).json({
            success: false,
            error: 'Task not found'
        });
        return;
    }

    res.status(200).json({
        success: true,
        data: task
    });
}));

// ─── Update a Task ───────────────────────────────────────────────────────────

router.put('/:id', asyncHandleWrapper(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (req.body.project) {
        const projectExists = await Project.findById(req.body.project);
        if (!projectExists) {
            res.status(404).json({
                success: false,
                error: 'Project not found'
            });
            return;
        }
    }

    const task = await Task.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    ).populate('project', 'name description');

    if (!task) {
        res.status(404).json({
            success: false,
            error: 'Task not found'
        });
        return;
    }

    res.status(200).json({
        success: true,
        data: task
    });
}));

// ─── Toggle Task Complete / Incomplete ───────────────────────────────────────

router.patch('/:id/complete', asyncHandleWrapper(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const task = await Task.findById(req.params.id);

    if (!task) {
        res.status(404).json({
            success: false,
            error: 'Task not found'
        });
        return;
    }

    task.completed = !task.completed;
    await task.save();

    res.status(200).json({
        success: true,
        data: task
    });
}));

// ─── Delete a Task ───────────────────────────────────────────────────────────

router.delete('/:id', asyncHandleWrapper(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
        res.status(404).json({
            success: false,
            error: 'Task not found'
        });
        return;
    }

    res.status(200).json({
        success: true,
        data: {},
        message: 'Task deleted successfully'
    });
}));

export default router;