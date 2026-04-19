import express, { Router, Request, Response, NextFunction } from 'express';
import Project from '../models/Project';
import Task from '../models/Task';
import asyncHandleWrapper from '../middleware/asyncHandlewrapp';

const router: Router = express.Router();

// ─── Create a New Project ────────────────────────────────────────────────────

router.post('/', asyncHandleWrapper(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { name, description } = req.body;

    const exists = await Project.findOne({ name });
    if (exists) {
        res.status(400).json({
            success: false,
            message: 'Project already exists'
        });
        return;
    }

    const project = new Project({ name, description });
    await project.save();

    res.status(201).json({
        success: true,
        data: project
    });
}));

// ─── Get All Projects ────────────────────────────────────────────────────────

router.get('/', asyncHandleWrapper(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const projects = await Project.find();

    res.status(200).json({
        success: true,
        count: projects.length,
        data: projects
    });
}));

// ─── Get Project Statistics ──────────────────────────────────────────────────

router.get('/:id/stats', asyncHandleWrapper(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const project = await Project.findById(req.params.id);

    if (!project) {
        res.status(404).json({
            success: false,
            error: 'Project not found'
        });
        return;
    }

    const now = new Date();

    const [totalTasks, completedTasks, overdueTasks] = await Promise.all([
        Task.countDocuments({ project: req.params.id }),
        Task.countDocuments({ project: req.params.id, completed: true }),
        Task.countDocuments({ project: req.params.id, dueDate: { $lt: now }, completed: false })
    ]);

    const pendingTasks = totalTasks - completedTasks;
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

// ─── Get One Project ─────────────────────────────────────────────────────────

router.get('/:id', asyncHandleWrapper(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const project = await Project.findById(req.params.id);

    if (!project) {
        res.status(404).json({
            success: false,
            error: 'Project not found'
        });
        return;
    }

    res.status(200).json({
        success: true,
        data: project
    });
}));

// ─── Update a Project ────────────────────────────────────────────────────────

router.put('/:id', asyncHandleWrapper(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const project = await Project.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,          // Return updated document
            runValidators: true // Enforce schema rules
        }
    );

    if (!project) {
        res.status(404).json({
            success: false,
            error: 'Project not found'
        });
        return;
    }

    res.status(200).json({
        success: true,
        data: project
    });
}));

// ─── Delete a Project ────────────────────────────────────────────────────────

router.delete('/:id', asyncHandleWrapper(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
        res.status(404).json({
            success: false,
            error: 'Project not found'
        });
        return;
    }

    res.status(200).json({
        success: true,
        data: {},
        message: 'Project deleted successfully'
    });
}));

// ─── Get Project With Its Tasks ──────────────────────────────────────────────

router.get('/:id/tasks', asyncHandleWrapper(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const project = await Project.findById(req.params.id);

    if (!project) {
        res.status(404).json({
            success: false,
            error: 'Project not found'
        });
        return;
    }

    const tasks = await Task.find({ project: req.params.id }).sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        data: {
            project,
            tasks,
            taskCount: tasks.length
        }
    });
}));

export default router;