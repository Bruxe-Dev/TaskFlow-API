import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import asyncHandlewrapper from '../middleware/asyncHandlewrapp';
import { Task, Project, Team, Field, User, Notification } from '../models';
import { UserRole, TaskStatus, Priority, NotificationType } from '../types';

/**
 * @desc Get task details
 * @route GET /api/tasks/:id
 * @access Private (authorized users only)
 */

export const getTask = asyncHandlewrapper(async (req: AuthRequest, res: Response) => {
    const task = await Task.findById(req.params.id)
        .populate('assignedTo assignedBy', 'username email profilePicture')
        .populate('project', 'title status deadline')
        .populate('dependencies', 'title status');

    if (!task) {
        res.status(404).json({
            success: false,
            message: "Task Not Found"
        })
        return;
    }

    const project = await Project.findById(task.project)
    if (!project) {
        res.status(404).json({
            success: false,
            message: "Project Not Found"
        })
        return;
    }

    const team = await Team.findById(project.team)
    if (!team) {
        res.status(404).json({
            success: false,
            message: "Team Not Found"
        })
        return;
    }

    const isMember = await team.members.some(
        (member: any) => member.user.toString() === req.user?._id.toString()
    )
    const field = await Field.findById(team.field)

    const isFieldAdmin = field?.admin.toString() === req.user?._id.toString()

    if (!isMember && !isFieldAdmin && req.user?.role !== UserRole.ORG_LEADER) {
        res.status(403).json({
            success: false,
            message: "UNAUTHORIZED"
        })
        return;
    }

    res.status(200).json({
        success: true,
        data: task
    })
})

/**
 * @desc Update Task
 * @route PUT /api/tasks/:id
 * @access Private (assigned users + admins)
 */

