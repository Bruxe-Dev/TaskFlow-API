import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import asyncHandlewrapper from '../middleware/asyncHandlewrapp';
import { Workspace, Team, Project, Update, User } from '../models';
import { UserRole } from '../types';

/**
 * @desc    Get workspace details
 * @route   GET /api/workspaces/:id
 * @access  Private (team members only)
 */
export const getWorkspace = asyncHandlewrapper(async (req: AuthRequest, res: Response) => {
    const workspace = await Workspace.findById(req.params.id)
        .populate('team')
        .populate({
            path: 'projects',
            populate: {
                path: 'assignedBy tasks',
                select: 'username title status'
            }
        });

    if (!workspace) {
        res.status(404).json({
            success: false,
            error: 'Workspace not found'
        });
        return;
    }

    // Check if user is a team member
    const team = await Team.findById(workspace.team);

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

    if (!isMember && req.user?.role !== UserRole.ORG_LEADER) {
        res.status(403).json({
            success: false,
            error: 'Only team members can access this workspace'
        });
        return;
    }

    res.status(200).json({
        success: true,
        data: workspace
    });
});

/**
 * @desc    Update workspace settings
 * @route   PUT /api/workspaces/:id
 * @access  Private (team leader or field admin)
 */
export const updateWorkspace = asyncHandlewrapper(async (req: AuthRequest, res: Response) => {
    const { name, description, aiAssistantEnabled, settings } = req.body;

    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
        res.status(404).json({
            success: false,
            error: 'Workspace not found'
        });
        return;
    }

    const team = await Team.findById(workspace.team);

    if (!team) {
        res.status(404).json({
            success: false,
            error: 'Team not found'
        });
        return;
    }

    // Check if user is team leader or field admin
    const isTeamLeader = team.teamLeader.toString() === req.user?._id.toString();
    const isFieldAdmin = req.user?.role === UserRole.FIELD_ADMIN;

    if (!isTeamLeader && !isFieldAdmin) {
        res.status(403).json({
            success: false,
            error: 'Only team leader or field admin can update workspace settings'
        });
        return;
    }

    // Update fields
    if (name) workspace.name = name;
    if (description) workspace.description = description;
    if (aiAssistantEnabled !== undefined) workspace.aiAssistantEnabled = aiAssistantEnabled;

    if (settings) {
        if (settings.allowFileSharing !== undefined) {
            workspace.settings.allowFileSharing = settings.allowFileSharing;
        }
        if (settings.notifyOnUpdates !== undefined) {
            workspace.settings.notifyOnUpdates = settings.notifyOnUpdates;
        }
    }

    await workspace.save();

    res.status(200).json({
        success: true,
        message: 'Workspace updated successfully',
        data: workspace
    });
});

/**
 * @desc    Get all projects in workspace
 * @route   GET /api/workspaces/:id/projects
 * @access  Private (team members only)
 */
export const getWorkspaceProjects = asyncHandlewrapper(async (req: AuthRequest, res: Response) => {
    const workspace = await Workspace.findById(req.params.id)
        .populate({
            path: 'projects',
            populate: [
                { path: 'assignedBy', select: 'username email' },
                { path: 'tasks', select: 'title status priority dueDate' }
            ]
        });

    if (!workspace) {
        res.status(404).json({
            success: false,
            error: 'Workspace not found'
        });
        return;
    }

    // Check access
    const team = await Team.findById(workspace.team);

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

    if (!isMember && req.user?.role !== UserRole.ORG_LEADER && req.user?.role !== UserRole.FIELD_ADMIN) {
        res.status(403).json({
            success: false,
            error: 'You do not have access to this workspace'
        });
        return;
    }

    res.status(200).json({
        success: true,
        count: workspace.projects.length,
        data: workspace.projects
    });
});

/**
 * @desc    Get all updates in workspace
 * @route   GET /api/workspaces/:id/updates
 * @access  Private (team members only)
 */
export const getWorkspaceUpdates = asyncHandlewrapper(async (req: AuthRequest, res: Response) => {
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
        res.status(404).json({
            success: false,
            error: 'Workspace not found'
        });
        return;
    }

    // Check access
    const team = await Team.findById(workspace.team);

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

    if (!isMember) {
        res.status(403).json({
            success: false,
            error: 'Only team members can view workspace updates'
        });
        return;
    }

    // Get updates for this workspace
    const updates = await Update.find({ workspace: workspace._id })
        .populate('user', 'username email profilePicture')
        .populate('mentions', 'username')
        .sort({ createdAt: -1 })
        .limit(50);  // Limit to last 50 updates

    res.status(200).json({
        success: true,
        count: updates.length,
        data: updates
    });
});

/**
 * @desc    Post update in workspace
 * @route   POST /api/workspaces/:id/updates
 * @access  Private (team members only)
 */
export const postWorkspaceUpdate = asyncHandlewrapper(async (req: AuthRequest, res: Response) => {
    const { type, content, relatedTo, mentions, attachments } = req.body;

    if (!content) {
        res.status(400).json({
            success: false,
            error: 'Update content is required'
        });
        return;
    }

    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
        res.status(404).json({
            success: false,
            error: 'Workspace not found'
        });
        return;
    }

    // Check access
    const team = await Team.findById(workspace.team);

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

    if (!isMember) {
        res.status(403).json({
            success: false,
            error: 'Only team members can post updates'
        });
        return;
    }

    // Create update
    const update = await Update.create({
        workspace: workspace._id,
        user: req.user?._id,
        type: type || 'comment',
        content,
        relatedTo,
        mentions: mentions || [],
        attachments: attachments || []
    });

    // Populate before sending response
    const populatedUpdate = await Update.findById(update._id)
        .populate('user', 'username email profilePicture')
        .populate('mentions', 'username');

    res.status(201).json({
        success: true,
        message: 'Update posted successfully',
        data: populatedUpdate
    });
});

/**
 * @desc    Get workspace members
 * @route   GET /api/workspaces/:id/members
 * @access  Private (team members only)
 */
export const getWorkspaceMembers = asyncHandlewrapper(async (req: AuthRequest, res: Response) => {
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
        res.status(404).json({
            success: false,
            error: 'Workspace not found'
        });
        return;
    }

    const team = await Team.findById(workspace.team)
        .populate('teamLeader', 'username email profilePicture role')
        .populate('members.user', 'username email profilePicture role');

    if (!team) {
        res.status(404).json({
            success: false,
            error: 'Team not found'
        });
        return;
    }

    // Check access
    const isMember = team.members.some(
        (member: any) => member.user._id.toString() === req.user?._id.toString()
    );

    if (!isMember && req.user?.role !== UserRole.ORG_LEADER && req.user?.role !== UserRole.FIELD_ADMIN) {
        res.status(403).json({
            success: false,
            error: 'You do not have access to this workspace'
        });
        return;
    }

    res.status(200).json({
        success: true,
        data: {
            teamLeader: team.teamLeader,
            members: team.members,
            totalMembers: team.members.length
        }
    });
});

/**
 * @desc    Update workspace settings
 * @route   PUT /api/workspaces/:id/settings
 * @access  Private (team leader only)
 */
export const updateWorkspaceSettings = asyncHandlewrapper(async (req: AuthRequest, res: Response) => {
    const { allowFileSharing, notifyOnUpdates, aiAssistantEnabled } = req.body;

    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
        res.status(404).json({
            success: false,
            error: 'Workspace not found'
        });
        return;
    }

    const team = await Team.findById(workspace.team);

    if (!team) {
        res.status(404).json({
            success: false,
            error: 'Team not found'
        });
        return;
    }

    // Only team leader can change settings
    if (team.teamLeader.toString() !== req.user?._id.toString()) {
        res.status(403).json({
            success: false,
            error: 'Only the team leader can change workspace settings'
        });
        return;
    }

    // Update settings
    if (allowFileSharing !== undefined) {
        workspace.settings.allowFileSharing = allowFileSharing;
    }
    if (notifyOnUpdates !== undefined) {
        workspace.settings.notifyOnUpdates = notifyOnUpdates;
    }
    if (aiAssistantEnabled !== undefined) {
        workspace.aiAssistantEnabled = aiAssistantEnabled;
    }

    await workspace.save();

    res.status(200).json({
        success: true,
        message: 'Workspace settings updated successfully',
        data: workspace
    });
});