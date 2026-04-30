import { Response, text } from 'express';
import { AuthRequest } from '../middleware/auth';
import asyncHandlewrapper from '../middleware/asyncHandlewrapp';
import { Project, Workspace, Team, Field, Task, User, Notification } from '../models';
import { UserRole, ProjectStatus, Priority, NotificationType } from '../types';

/**
 * @desc Creating a new Project
 * @route POST /api/projects/
 * @access Private (Field Admins Only)
 */

export const createProject = asyncHandlewrapper(async (req: AuthRequest, res: Response) => {
    const { name, description, workspaceId, teamId, priority, deadline } = req.body;

    if (!name || !workspaceId || !teamId) {
        res.status(400).json({
            success: false,
            message: "Name, Workspace and team are required"
        })
        return;
    }

    const workspace = await Workspace.findById(workspaceId)

    if (!workspace) {
        res.status(404).json({
            success: false,
            message: "Workspace Not Found"
        })
        return;
    }

    const team = await Team.findById(teamId)
    if (!team) {
        res.status(404).json({
            success: false,
            message: "Team Not Found"
        })
        return;
    }

    const field = await Field.findById(team.field)
    if (!field) {
        res.status(404).json({
            success: false,
            message: "Field Not Found"
        })
        return;
    }

    if (field.admin.toString() !== req.user?._id.toString() && req.user?.role !== UserRole.ORG_LEADER) {
        res.status(403).json({
            success: false,
            message: "UNAUTHORIZED"
        })
        return;
    }

    const project = await Project.create({
        name,
        description,
        workspace: workspaceId,
        team: teamId,
        assignedBy: req.user?._id,
        status: ProjectStatus.PENDING,
        priority: priority || Priority.MEDIUM,
        deadline,
        progress: 0
    });

    workspace.projects.push(project._id);
    await workspace.save();

    // Create notifications for all team members
    const teamMembers = team.members.map((member: any) => member.user);

    const notifications = teamMembers.map((userId: any) => ({
        recipient: userId,
        sender: req.user?._id,
        type: NotificationType.PROJECT_UPDATE,
        title: 'New Project Assigned',
        message: `You have been assigned a new project: ${name}`,
        link: `/workspaces/${workspaceId}/projects/${project._id}`,
        priority: priority || Priority.MEDIUM
    }));

    await Notification.insertMany(notifications)

    const populatedProject = await Project.findById(project._id)
        .populate('assignedBy', 'username email')
        .populate('team', 'name')
        .populate('workspace', 'name');

    res.status(201).json({
        success: true,
        message: 'Project created and assigned successfully',
        data: populatedProject
    });
});


/**
 * @desc Get project Details
 * @route GET /api/projects/:id
 * @Private  authorized users only
 */

export const getProject = asyncHandlewrapper(async (req: AuthRequest, res: Response) => {
    const project = await Project.findById(req.params.id)
        .populate('assignedBy', 'username email')
        .populate('team', 'name members')
        .populate('workspace', 'name')
        .populate({
            path: 'tasks',
            populate: {
                path: 'assignedTo assignedBy',
                select: 'username email'
            }
        })
        .populate('submissions');

    if (!project) {
        res.status(404).json({
            success: false,
            message: "Project Not Found"
        })
        return
    }

    const team = await Team.findById(project.team)
    if (!team) {
        res.status(404).json({
            success: false,
            message: "Team Not Found"
        })
        return;
    }

    const isMember = team.members.some(
        (member: any) => member.user.toString() === req.user?._id.toString()
    );
    const field = await Field.findById(team.field)
    const isFieldAdmin = field?.admin.toString() === req.user?._id.toString()
    const isOrgLeader = req.user?.role === UserRole.ORG_LEADER

    if (!isFieldAdmin && !isMember && !isOrgLeader) {
        res.status(403).json({
            success: false,
            message: "UNAUTHORIZED"
        })
        return;
    }

    res.status(200).json({
        success: true,
        data: project
    })
})