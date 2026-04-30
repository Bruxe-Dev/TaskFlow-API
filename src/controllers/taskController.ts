import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import asyncHandlewrapper from '../middleware/asyncHandlewrapp';
import { Task, Project, Team, Field, User, Notification } from '../models';
import { UserRole, TaskStatus, Priority, NotificationType } from '../types';

/**
 * @desc    Get task details
 * @route   GET /api/tasks/:id
 * @access  Private (authorized users only)
 */
export const getTask = asyncHandlewrapper(async (req: AuthRequest, res: Response) => {
    const task = await Task.findById(req.params.id)
        .populate('assignedTo assignedBy', 'username email profilePicture')
        .populate('project', 'title status deadline')
        .populate('dependencies', 'title status');

    if (!task) {
        res.status(404).json({
            success: false,
            error: 'Task not found'
        });
        return;
    }

    // Check access
    const project = await Project.findById(task.project);
    if (!project) {
        res.status(404).json({
            success: false,
            error: 'Project not found'
        });
        return;
    }

    const team = await Team.findById(project.team);
    if (!team) {
        res.status(404).json({
            success: false,
            error: 'Team not found'
        });
        return;
    }

    const isMember = team.members.some(
        (member: any) => member.user.toString() === req.user?._id.toString()
    );

    const field = await Field.findById(team.field);
    const isFieldAdmin = field?.admin.toString() === req.user?._id.toString();

    if (!isMember && !isFieldAdmin && req.user?.role !== UserRole.ORG_LEADER) {
        res.status(403).json({
            success: false,
            error: 'You do not have access to this task'
        });
        return;
    }

    res.status(200).json({
        success: true,
        data: task
    });
});

/**
 * @desc    Update task
 * @route   PUT /api/tasks/:id
 * @access  Private (assigned users + field admin)
 */
export const updateTask = asyncHandlewrapper(async (req: AuthRequest, res: Response) => {
    const { title, description, priority, dueDate, status } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
        res.status(404).json({
            success: false,
            error: 'Task not found'
        });
        return;
    }

    // Check if user can update this task
    const isAssigned = task.assignedTo.some(
        (userId: any) => userId.toString() === req.user?._id.toString()
    );

    const project = await Project.findById(task.project);
    const team = await Team.findById(project?.team);
    const field = await Field.findById(team?.field);
    const isFieldAdmin = field?.admin.toString() === req.user?._id.toString();

    if (!isAssigned && !isFieldAdmin && req.user?.role !== UserRole.ORG_LEADER) {
        res.status(403).json({
            success: false,
            error: 'You do not have permission to update this task'
        });
        return;
    }

    // Update fields
    if (title) task.name = title;
    if (description) task.description = description;
    if (priority) task.priority = priority;
    if (dueDate) task.dueDate = new Date(dueDate);
    if (status) task.status = status;

    await task.save();

    const updatedTask = await Task.findById(task._id)
        .populate('assignedTo assignedBy', 'username email');

    res.status(200).json({
        success: true,
        message: 'Task updated successfully',
        data: updatedTask
    });
});

/**
 * @desc    Delete task
 * @route   DELETE /api/tasks/:id
 * @access  Private (field admin only)
 */
export const deleteTask = asyncHandlewrapper(async (req: AuthRequest, res: Response) => {
    const task = await Task.findById(req.params.id);

    if (!task) {
        res.status(404).json({
            success: false,
            error: 'Task not found'
        });
        return;
    }

    const project = await Project.findById(task.project);
    if (!project) {
        res.status(404).json({
            success: false,
            error: 'Project not found'
        });
        return;
    }

    const team = await Team.findById(project.team);
    const field = await Field.findById(team?.field);

    // Only field admin can delete tasks
    if (field?.admin.toString() !== req.user?._id.toString() && req.user?.role !== UserRole.ORG_LEADER) {
        res.status(403).json({
            success: false,
            error: 'Only the field admin can delete tasks'
        });
        return;
    }

    // Remove task from project
    await Project.findByIdAndUpdate(task.project, {
        $pull: { tasks: task._id }
    });

    // Delete the task
    await task.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Task deleted successfully'
    });
});

/**
 * @desc    Update task status
 * @route   PATCH /api/tasks/:id/status
 * @access  Private (assigned users)
 */
export const updateTaskStatus = asyncHandlewrapper(async (req: AuthRequest, res: Response) => {
    const { status } = req.body;

    if (!status || !Object.values(TaskStatus).includes(status)) {
        res.status(400).json({
            success: false,
            error: 'Invalid status value'
        });
        return;
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
        res.status(404).json({
            success: false,
            error: 'Task not found'
        });
        return;
    }

    // Check if user is assigned to this task
    const isAssigned = task.assignedTo.some(
        (userId: any) => userId.toString() === req.user?._id.toString()
    );

    if (!isAssigned) {
        res.status(403).json({
            success: false,
            error: 'Only assigned users can update task status'
        });
        return;
    }

    task.status = status;
    await task.save();

    res.status(200).json({
        success: true,
        message: 'Task status updated successfully',
        data: task
    });
});

/**
 * @desc    Toggle task completion
 * @route   PATCH /api/tasks/:id/complete
 * @access  Private (assigned users)
 */
export const toggleTaskCompletion = asyncHandlewrapper(async (req: AuthRequest, res: Response) => {
    const task = await Task.findById(req.params.id);

    if (!task) {
        res.status(404).json({
            success: false,
            error: 'Task not found'
        });
        return;
    }

    // Check if user is assigned to this task
    const isAssigned = task.assignedTo.some(
        (userId: any) => userId.toString() === req.user?._id.toString()
    );

    if (!isAssigned) {
        res.status(403).json({
            success: false,
            error: 'Only assigned users can complete tasks'
        });
        return;
    }

    // Toggle status
    if (task.status === TaskStatus.COMPLETED) {
        task.status = TaskStatus.IN_PROGRESS;
    } else {
        task.status = TaskStatus.COMPLETED;
    }

    await task.save();

    res.status(200).json({
        success: true,
        message: `Task marked as ${task.status === TaskStatus.COMPLETED ? 'completed' : 'incomplete'}`,
        data: task
    });
});

/**
 * @desc    Add attachment to task
 * @route   POST /api/tasks/:id/attachments
 * @access  Private (assigned users)
 */
export const addTaskAttachment = asyncHandlewrapper(async (req: AuthRequest, res: Response) => {
    const { name, url } = req.body;

    if (!name || !url) {
        res.status(400).json({
            success: false,
            error: 'Attachment name and URL are required'
        });
        return;
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
        res.status(404).json({
            success: false,
            error: 'Task not found'
        });
        return;
    }

    // Check if user is assigned to this task or is field admin
    const isAssigned = task.assignedTo.some(
        (userId: any) => userId.toString() === req.user?._id.toString()
    );

    if (!isAssigned && req.user?.role !== UserRole.FIELD_ADMIN) {
        res.status(403).json({
            success: false,
            error: 'Only assigned users can add attachments'
        });
        return;
    }

    task.attachments.push({
        name,
        url,
        uploadedAt: new Date()
    });

    await task.save();

    res.status(200).json({
        success: true,
        message: 'Attachment added successfully',
        data: task
    });
});

/**
 * @desc    Remove attachment from task
 * @route   DELETE /api/tasks/:id/attachments/:attachmentId
 * @access  Private (assigned users)
 */
export const removeTaskAttachment = asyncHandlewrapper(async (req: AuthRequest, res: Response) => {
    const task = await Task.findById(req.params.id);

    if (!task) {
        res.status(404).json({
            success: false,
            error: 'Task not found'
        });
        return;
    }

    // Check if user is assigned to this task
    const isAssigned = task.assignedTo.some(
        (userId: any) => userId.toString() === req.user?._id.toString()
    );

    if (!isAssigned && req.user?.role !== UserRole.FIELD_ADMIN) {
        res.status(403).json({
            success: false,
            error: 'Only assigned users can remove attachments'
        });
        return;
    }

    // Remove attachment
    task.attachments = task.attachments.filter(
        (attachment: any) => attachment._id.toString() !== req.params.attachmentId
    );

    await task.save();

    res.status(200).json({
        success: true,
        message: 'Attachment removed successfully',
        data: task
    });
});

/**
 * @desc    Get tasks by project
 * @route   GET /api/tasks/project/:projectId
 * @access  Private (team members)
 */
export const getTasksByProject = asyncHandlewrapper(async (req: AuthRequest, res: Response) => {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
        res.status(404).json({
            success: false,
            error: 'Project not found'
        });
        return;
    }

    const tasks = await Task.find({ project: project._id })
        .populate('assignedTo assignedBy', 'username email')
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: tasks.length,
        data: tasks
    });
});

/**
 * @desc    Get current user's assigned tasks
 * @route   GET /api/tasks/user/assigned
 * @access  Private
 */
export const getMyAssignedTasks = asyncHandlewrapper(async (req: AuthRequest, res: Response) => {
    const tasks = await Task.find({
        assignedTo: req.user?._id
    })
        .populate('assignedBy', 'username email')
        .populate('project', 'title status deadline')
        .sort({ dueDate: 1 });  // Sort by due date

    res.status(200).json({
        success: true,
        count: tasks.length,
        data: tasks
    });
});

/**
 * @desc    Get overdue tasks
 * @route   GET /api/tasks/overdue
 * @access  Private
 */
export const getOverdueTasks = asyncHandlewrapper(async (req: AuthRequest, res: Response) => {
    const now = new Date();

    // Get user's teams
    const user = await User.findById(req.user?._id).populate('teams');

    if (!user || !user.teams || user.teams.length === 0) {
        res.status(200).json({
            success: true,
            count: 0,
            data: []
        });
        return;
    }

    // Get projects from user's teams
    const teamIds = user.teams.map((team: any) => team._id);
    const projects = await Project.find({ team: { $in: teamIds } });
    const projectIds = projects.map(p => p._id);

    // Get overdue tasks from those projects
    const tasks = await Task.find({
        project: { $in: projectIds },
        dueDate: { $lt: now },
        status: { $ne: TaskStatus.COMPLETED }
    })
        .populate('assignedTo assignedBy', 'username email')
        .populate('project', 'title')
        .sort({ dueDate: 1 });

    res.status(200).json({
        success: true,
        count: tasks.length,
        data: tasks
    });
});

/**
 * @desc    Get upcoming tasks (due in next 7 days)
 * @route   GET /api/tasks/upcoming
 * @access  Private
 */
export const getUpcomingTasks = asyncHandlewrapper(async (req: AuthRequest, res: Response) => {
    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    // Get user's teams
    const user = await User.findById(req.user?._id).populate('teams');

    if (!user || !user.teams || user.teams.length === 0) {
        res.status(200).json({
            success: true,
            count: 0,
            data: []
        });
        return;
    }

    // Get projects from user's teams
    const teamIds = user.teams.map((team: any) => team._id);
    const projects = await Project.find({ team: { $in: teamIds } });
    const projectIds = projects.map(p => p._id);

    // Get upcoming tasks
    const tasks = await Task.find({
        project: { $in: projectIds },
        dueDate: {
            $gte: now,
            $lte: nextWeek
        },
        status: { $ne: TaskStatus.COMPLETED }
    })
        .populate('assignedTo assignedBy', 'username email')
        .populate('project', 'title')
        .sort({ dueDate: 1 });

    res.status(200).json({
        success: true,
        count: tasks.length,
        data: tasks
    });
});