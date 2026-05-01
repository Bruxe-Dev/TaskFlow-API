import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import asyncHandlewrapper from '../middleware/asyncHandlewrapp';
import { Organization, Field, Team, Project, Task, User, Submission, ProblemReport } from '../models';
import { UserRole, TaskStatus, ProjectStatus, ProblemStatus } from '../types';

/**
 * @desc    Get organization leader dashboard
 * @route   GET /api/dashboard/org-leader
 * @access  Private (org leader only)
 */

export const getOrgLeaderDashboard = asyncHandlewrapper(async (req: AuthRequest, res: Response) => {
    if (req.user?.role !== UserRole.ORG_LEADER) {
        res.status(403).json({ success: false, error: 'Only organization leaders can access this dashboard' });
        return;
    }

    const organization = await Organization.findById(req.user.organization).populate('fields');

    if (!organization) {
        res.status(404).json({ success: false, error: 'Organization not found' });
        return;
    }

    const teamData = await Team.find({ organization: organization._id }).select('_id');
    const teamIds = teamData.map(t => t._id);

    const totalMembers = await User.countDocuments({ organization: organization._id });
    const totalFields = organization.fields.length;
    const totalTeams = await Team.countDocuments({ organization: organization._id });

    const totalProjects = await Project.countDocuments({
        team: { $in: teamIds }
    });

    const fieldStats = await Promise.all(
        organization.fields.map(async (fieldId: any) => {
            const field = await Field.findById(fieldId).populate('admin', 'username email');
            const teams = await Team.find({ field: fieldId });
            const currentFieldTeamIds = teams.map(t => t._id);
            const projects = await Project.find({ team: { $in: currentFieldTeamIds } });

            return {
                field: {
                    _id: field?._id,
                    name: field?.name,
                    admin: field?.admin
                },
                stats: {
                    teams: teams.length,
                    projects: projects.length,
                    activeProjects: projects.filter(p => p.status === ProjectStatus.IN_PROGRESS).length
                }
            };
        })
    );

    const recentProjects = await Project.find({
        team: { $in: teamIds }
    })
        .populate('team', 'name')
        .populate('assignedBy', 'username')
        .sort({ createdAt: -1 })
        .limit(5);

    res.status(200).json({
        success: true,
        data: {
            organization: {
                name: organization.name,
                description: organization.description,
                industry: organization.industry
            },
            overview: { totalMembers, totalFields, totalTeams, totalProjects },
            fields: fieldStats,
            recentActivity: recentProjects
        }
    });
});

/**
 * @desc    Get field admin dashboard
 * @route   GET /api/dashboard/field-admin
 * @access  Private (field admin only)
 */

export const getFieldAdminDashboard = asyncHandlewrapper(async (req: AuthRequest, res: Response) => {
    if (req.user?.role !== UserRole.FIELD_ADMIN) {
        res.status(403).json({ success: false, error: 'Only field admins can access this dashboard' });
        return;
    }

    const field = await Field.findOne({ admin: req.user._id });

    if (!field) {
        res.status(404).json({ success: false, error: 'Field not found' });
        return;
    }

    const teams = await Team.find({ field: field._id });
    const teamIds = teams.map(t => t._id);

    const projects = await Project.find({ team: { $in: teamIds } });
    const projectIds = projects.map(p => p._id);

    const tasks = await Task.find({ project: { $in: projectIds } });

    const stats = {
        totalTeams: teams.length,
        totalProjects: projects.length,
        activeProjects: projects.filter(p => p.status === ProjectStatus.IN_PROGRESS).length,
        completedProjects: projects.filter(p => p.status === ProjectStatus.COMPLETED).length,
        totalTasks: tasks.length,
        completedTasks: tasks.filter(t => t.status === TaskStatus.COMPLETED).length,
        overdueTasks: tasks.filter(t => t.dueDate && t.dueDate < new Date() && t.status !== TaskStatus.COMPLETED).length
    };

    const teamPerformance = await Promise.all(
        teams.map(async (team) => {
            const teamProjects = projects.filter(p => p.team.toString() === team._id.toString());
            const teamProjectIds = teamProjects.map(p => p._id.toString());

            // FIX: Ensure comparison is done via string for task.project
            const teamTasks = tasks.filter(t => teamProjectIds.includes(t.project.toString()));

            const completedTasks = teamTasks.filter(t => t.status === TaskStatus.COMPLETED).length;
            const progress = teamTasks.length > 0 ? Math.round((completedTasks / teamTasks.length) * 100) : 0;

            return {
                team: { _id: team._id, name: team.name },
                stats: {
                    projects: teamProjects.length,
                    tasks: teamTasks.length,
                    completedTasks,
                    progress: `${progress}%`
                }
            };
        })
    );

    const pendingSubmissions = await Submission.find({
        team: { $in: teamIds },
        status: 'pending'
    })
        .populate('submittedBy', 'username')
        .populate('project', 'title')
        .populate('team', 'name')
        .sort({ submittedAt: -1 })
        .limit(5);

    const openReports = await ProblemReport.find({
        team: { $in: teamIds },
        status: { $in: [ProblemStatus.OPEN, ProblemStatus.IN_PROGRESS] }
    })
        .populate('reportedBy', 'username')
        .populate('team', 'name')
        .sort({ createdAt: -1 })
        .limit(5);

    res.status(200).json({
        success: true,
        data: {
            field: { name: field.name, description: field.description },
            overview: stats,
            teamPerformance,
            pendingSubmissions,
            openReports
        }
    });
});

/**
 * @desc    Get team member dashboard
 * @route   GET /api/dashboard/team-member
 * @access  Private
 */

export const getTeamMemberDashboard = asyncHandlewrapper(async (req: AuthRequest, res: Response) => {
    const user = await User.findById(req.user?._id).populate('teams');

    if (!user) {
        res.status(404).json({ success: false, error: 'User not found' });
        return;
    }

    const teamIds = user.teams.map((team: any) => team._id);

    const myTasks = await Task.find({ assignedTo: user._id })
        .populate('project', 'title deadline')
        .sort({ dueDate: 1 });

    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    res.status(200).json({
        success: true,
        data: {
            user: { username: user.username, email: user.email, teams: user.teams },
            taskSummary: {
                total: myTasks.length,
                completed: myTasks.filter(t => t.status === TaskStatus.COMPLETED).length,
                inProgress: myTasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length,
                todo: myTasks.filter(t => t.status === TaskStatus.TODO).length,
                overdue: myTasks.filter(t => t.dueDate && t.dueDate < now && t.status !== TaskStatus.COMPLETED).length
            },
            overdueTasks: myTasks.filter(t => t.dueDate && t.dueDate < now && t.status !== TaskStatus.COMPLETED).slice(0, 5),
            upcomingTasks: myTasks.filter(t => t.dueDate && t.dueDate >= now && t.dueDate <= nextWeek && t.status !== TaskStatus.COMPLETED).slice(0, 5),
            recentProjects: await Project.find({ team: { $in: teamIds } }).populate('team', 'name').populate('assignedBy', 'username').sort({ createdAt: -1 }).limit(5)
        }
    });
});

/**
 * @desc    Get analytics data
 * @route   GET /api/dashboard/analytics
 * @access  Private
 */

export const getAnalytics = asyncHandlewrapper(async (req: AuthRequest, res: Response) => {
    const { startDate, endDate, teamId, projectId } = req.query;
    let query: any = {};

    if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate as string);
        if (endDate) query.createdAt.$lte = new Date(endDate as string);
    }

    if (teamId) {
        const projects = await Project.find({ team: teamId }).select('_id');
        query.project = { $in: projects.map(p => p._id) };
    }

    if (projectId) query.project = projectId;

    const tasks = await Task.find(query);

    res.status(200).json({
        success: true,
        data: {
            totalTasks: tasks.length,
            completedTasks: tasks.filter(t => t.status === TaskStatus.COMPLETED).length,
            avgCompletionTime: calculateAvgCompletionTime(tasks),
            tasksByStatus: {
                todo: tasks.filter(t => t.status === TaskStatus.TODO).length,
                inProgress: tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length,
                completed: tasks.filter(t => t.status === TaskStatus.COMPLETED).length
            },
            tasksByPriority: {
                low: tasks.filter(t => t.priority === 'low').length,
                medium: tasks.filter(t => t.priority === 'medium').length,
                high: tasks.filter(t => t.priority === 'high').length,
                urgent: tasks.filter(t => t.priority === 'urgent').length
            }
        }
    });
});

function calculateAvgCompletionTime(tasks: any[]): string {
    const completedTasks = tasks.filter(t => t.completedAt && t.createdAt);
    if (completedTasks.length === 0) return 'N/A';

    const totalTime = completedTasks.reduce((sum, task) => sum + (task.completedAt.getTime() - task.createdAt.getTime()), 0);
    const avgDays = Math.round((totalTime / completedTasks.length) / (1000 * 60 * 60 * 24));

    return `${avgDays} days`;
}