import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import asyncHandlewrapper from '../middleware/asyncHandlewrapp';
import { Project, Workspace, Team, Field, Task, User, Notification } from '../models';
import { UserRole, ProjectStatus, Priority, NotificationType } from '../types';

/**
 * @desc    Create a new project
 * @route   POST /api/projects
 * @access  Private (field admin only)
 */
export const createProject = asyncHandlewrapper(async (req: AuthRequest, res: Response) => {
    const { name, description, workspaceId, teamId, priority, deadline } = req.body;

    if (!name || !workspaceId || !teamId) {
        res.status(400).json({
            success: false,
            error: 'Name, workspace, and team are required'
        });
        return;
    }

    // Verify workspace exists
    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
        res.status(404).json({
            success: false,
            error: 'Workspace not found'
        });
        return;
    }

    // Verify team exists
    const team = await Team.findById(teamId);

    if (!team) {
        res.status(404).json({
            success: false,
            error: 'Team not found'
        });
        return;
    }

    // Verify user is field admin of this team's field
    const field = await Field.findById(team.field);

    if (!field) {
        res.status(404).json({
            success: false,
            error: 'Field not found'
        });
        return;
    }

    if (field.admin.toString() !== req.user?._id.toString() && req.user?.role !== UserRole.ORG_LEADER) {
        res.status(403).json({
            success: false,
            error: 'Only the field admin can assign projects to teams'
        });
        return;
    }

    // Create project
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

    // Add project to workspace
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

    await Notification.insertMany(notifications);

    // Populate and return
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
 * @desc    Get project details
 * @route   GET /api/projects/:id
 * @access  Private (authorized users only)
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
            error: 'Project not found'
        });
        return;
    }

    // Check access
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
    const isOrgLeader = req.user?.role === UserRole.ORG_LEADER;

    if (!isMember && !isFieldAdmin && !isOrgLeader) {
        res.status(403).json({
            success: false,
            error: 'You do not have access to this project'
        });
        return;
    }

    res.status(200).json({
        success: true,
        data: project
    });
});

/**
 * @desc    Update project
 * @route   PUT /api/projects/:id
 * @access  Private (field admin only)
 */
export const updateProject = asyncHandlewrapper(async (req: AuthRequest, res: Response) => {
    const { name, description, priority, deadline, status } = req.body;

    const project = await Project.findById(req.params.id);

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

    const field = await Field.findById(team.field);

    if (!field) {
        res.status(404).json({
            success: false,
            error: 'Field not found'
        });
        return;
    }

    // Only field admin can update projects
    if (field.admin.toString() !== req.user?._id.toString() && req.user?.role !== UserRole.ORG_LEADER) {
        res.status(403).json({
            success: false,
            error: 'Only the field admin can update projects'
        });
        return;
    }

    // Update fields
    if (name) project.name = name;
    if (description) project.description = description;
    if (priority) project.priority = priority;
    if (deadline) project.deadline = new Date(deadline);
    if (status) project.status = status;

    await project.save();

    const updatedProject = await Project.findById(project._id)
        .populate('assignedBy', 'username email')
        .populate('team', 'name')
        .populate('tasks');

    res.status(200).json({
        success: true,
        message: 'Project updated successfully',
        data: updatedProject
    });
});

/**
 * @desc    Delete project
 * @route   DELETE /api/projects/:id
 * @access  Private (field admin only)
 */
export const deleteProject = asyncHandlewrapper(async (req: AuthRequest, res: Response) => {
    const project = await Project.findById(req.params.id);

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

    const field = await Field.findById(team.field);

    if (!field) {
        res.status(404).json({
            success: false,
            error: 'Field not found'
        });
        return;
    }

    // Only field admin can delete projects
    if (field.admin.toString() !== req.user?._id.toString() && req.user?.role !== UserRole.ORG_LEADER) {
        res.status(403).json({
            success: false,
            error: 'Only the field admin can delete projects'
        });
        return;
    }

    // Remove project from workspace
    await Workspace.findByIdAndUpdate(project.workspace, {
        $pull: { projects: project._id }
    });

    // Delete all tasks associated with this project
    await Task.deleteMany({ project: project._id });

    // Delete the project
    await project.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Project deleted successfully'
    });
});

/**
 * @desc    Update project status
 * @route   PATCH /api/projects/:id/status
 * @access  Private (field admin + team members)
 */
export const updateProjectStatus = asyncHandlewrapper(async (req: AuthRequest, res: Response) => {
    const { status } = req.body;

    if (!status || !Object.values(ProjectStatus).includes(status)) {
        res.status(400).json({
            success: false,
            error: 'Invalid status value'
        });
        return;
    }

    const project = await Project.findById(req.params.id);

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

    // Check if user is team member or field admin
    const isMember = team.members.some(
        (member: any) => member.user.toString() === req.user?._id.toString()
    );

    const field = await Field.findById(team.field);
    const isFieldAdmin = field?.admin.toString() === req.user?._id.toString();

    if (!isMember && !isFieldAdmin) {
        res.status(403).json({
            success: false,
            error: 'You do not have permission to update this project'
        });
        return;
    }

    project.status = status;
    await project.save();

    res.status(200).json({
        success: true,
        message: 'Project status updated successfully',
        data: project
    });
});

/**
 * @desc    Get all tasks in project
 * @route   GET /api/projects/:id/tasks
 * @access  Private (authorized users only)
 */
export const getProjectTasks = asyncHandlewrapper(async (req: AuthRequest, res: Response) => {
    const project = await Project.findById(req.params.id);

    if (!project) {
        res.status(404).json({
            success: false,
            error: 'Project not found'
        });
        return;
    }

    // Check access
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
            error: 'You do not have access to this project'
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
 * @desc    Create task in project
 * @route   POST /api/projects/:id/tasks
 * @access  Private (field admin only)
 */
export const createProjectTask = asyncHandlewrapper(async (req: AuthRequest, res: Response) => {
    const { name, description, assignedTo, priority, dueDate, dependencies } = req.body;

    if (!name) {
        res.status(400).json({
            success: false,
            error: 'Task title is required'
        });
        return;
    }

    const project = await Project.findById(req.params.id);

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

    const field = await Field.findById(team.field);

    if (!field) {
        res.status(404).json({
            success: false,
            error: 'Field not found'
        });
        return;
    }

    // Only field admin can create tasks
    if (field.admin.toString() !== req.user?._id.toString() && req.user?.role !== UserRole.ORG_LEADER) {
        res.status(403).json({
            success: false,
            error: 'Only the field admin can create tasks'
        });
        return;
    }

    // Verify assigned users are team members
    if (assignedTo && assignedTo.length > 0) {
        const teamMemberIds = team.members.map((m: any) => m.user.toString());
        const invalidAssignees = assignedTo.filter((id: string) => !teamMemberIds.includes(id));

        if (invalidAssignees.length > 0) {
            res.status(400).json({
                success: false,
                error: 'All assigned users must be team members'
            });
            return;
        }
    }

    // Create task (we'll use the Task model from our existing setup)
    const task = await Task.create({
        name,
        description,
        project: project._id,
        assignedTo: assignedTo || [],
        assignedBy: req.user?._id,
        priority: priority || Priority.MEDIUM,
        dueDate,
        dependencies: dependencies || []
    });

    // Add task to project
    project.tasks.push(task._id);
    await project.save();

    // Create notifications for assigned users
    if (assignedTo && assignedTo.length > 0) {
        const notifications = assignedTo.map((userId: string) => ({
            recipient: userId,
            sender: req.user?._id,
            type: NotificationType.TASK_ASSIGNED,
            title: 'New Task Assigned',
            message: `You have been assigned a new task: ${name}`,
            link: `/projects/${project._id}/tasks/${task._id}`,
            priority: priority || Priority.MEDIUM
        }));

        await Notification.insertMany(notifications);
    }

    const populatedTask = await Task.findById(task._id)
        .populate('assignedTo assignedBy', 'username email');

    res.status(201).json({
        success: true,
        message: 'Task created successfully',
        data: populatedTask
    });
});

/**
 * @desc    Get project statistics
 * @route   GET /api/projects/:id/stats
 * @access  Private (authorized users only)
 */
export const getProjectStats = asyncHandlewrapper(async (req: AuthRequest, res: Response) => {
    const project = await Project.findById(req.params.id);

    if (!project) {
        res.status(404).json({
            success: false,
            error: 'Project not found'
        });
        return;
    }

    // Check access
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
            error: 'You do not have access to this project'
        });
        return;
    }

    // Calculate statistics
    const totalTasks = await Task.countDocuments({ project: project._id });
    const completedTasks = await Task.countDocuments({
        project: project._id,
        status: 'completed'
    });
    const inProgressTasks = await Task.countDocuments({
        project: project._id,
        status: 'in-progress'
    });
    const todoTasks = await Task.countDocuments({
        project: project._id,
        status: 'todo'
    });

    const now = new Date();
    const overdueTasks = await Task.countDocuments({
        project: project._id,
        dueDate: { $lt: now },
        status: { $ne: 'completed' }
    });

    // Calculate progress percentage
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Update project progress
    project.progress = progress;
    await project.save();

    res.status(200).json({
        success: true,
        data: {
            project: {
                title: project.name,
                status: project.status,
                priority: project.priority,
                deadline: project.deadline
            },
            tasks: {
                total: totalTasks,
                completed: completedTasks,
                inProgress: inProgressTasks,
                todo: todoTasks,
                overdue: overdueTasks
            },
            progress: `${progress}%`
        }
    });
});

/**
 * @desc    Get projects by workspace
 * @route   GET /api/projects/workspace/:workspaceId
 * @access  Private (team members only)
 */
export const getProjectsByWorkspace = asyncHandlewrapper(async (req: AuthRequest, res: Response) => {
    const workspace = await Workspace.findById(req.params.workspaceId);

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

    const projects = await Project.find({ workspace: workspace._id })
        .populate('assignedBy', 'username email')
        .populate('team', 'name')
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: projects.length,
        data: projects
    });
});