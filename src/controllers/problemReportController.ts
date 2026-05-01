import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import asyncHandlewrapper from '../middleware/asyncHandlewrapp';
import { ProblemReport, Team, Field, Notification } from '../models';
import { UserRole, ProblemCategory, ProblemSeverity, ProblemStatus, NotificationType, Priority } from '../types';

/**
 * @desc    Create problem report
 * @route   POST /api/reports
 * @access  Private (team members only)
 */
export const createProblemReport = asyncHandlewrapper(async (req: AuthRequest, res: Response) => {
    const { teamId, category, title, description, severity, attachments } = req.body;

    if (!teamId || !category || !title || !description) {
        res.status(400).json({
            success: false,
            error: 'Team, category, title, and description are required'
        });
        return;
    }

    const team = await Team.findById(teamId);

    if (!team) {
        res.status(404).json({
            success: false,
            error: 'Team not found'
        });
        return;
    }

    // Check if user is a team member
    const isMember = team.members.some(
        (member: any) => member.user.toString() === req.user?._id.toString()
    );

    if (!isMember) {
        res.status(403).json({
            success: false,
            error: 'Only team members can create problem reports'
        });
        return;
    }

    // Create report
    const report = await ProblemReport.create({
        reportedBy: req.user?._id,
        team: teamId,
        category,
        title,
        description,
        severity: severity || ProblemSeverity.MEDIUM,
        attachments: attachments || [],
        status: ProblemStatus.OPEN
    });

    // Notify field admin
    const field = await Field.findById(team.field);
    if (field) {
        await Notification.create({
            recipient: field.admin,
            sender: req.user?._id,
            type: NotificationType.ANNOUNCEMENT,
            title: 'New Problem Report',
            message: `${req.user?.username} reported a ${severity || 'medium'} severity issue: ${title}`,
            link: `/reports/${report._id}`,
            priority: severity === ProblemSeverity.CRITICAL ? Priority.URGENT : Priority.HIGH
        });
    }

    const populatedReport = await ProblemReport.findById(report._id)
        .populate('reportedBy', 'username email')
        .populate('team', 'name');

    res.status(201).json({
        success: true,
        message: 'Problem report created successfully',
        data: populatedReport
    });
});

/**
 * @desc    Get all reports (filtered by role)
 * @route   GET /api/reports
 * @access  Private
 */
export const getReports = asyncHandlewrapper(async (req: AuthRequest, res: Response) => {
    const { status, severity, category } = req.query;

    let query: any = {};

    // Filter by status
    if (status) {
        query.status = status;
    }

    // Filter by severity
    if (severity) {
        query.severity = severity;
    }

    // Filter by category
    if (category) {
        query.category = category;
    }

    // Role-based filtering
    if (req.user?.role === UserRole.FIELD_ADMIN) {
        // Field admin sees reports from their field's teams
        const field = await Field.findOne({ admin: req.user._id });
        if (field) {
            const teams = await Team.find({ field: field._id });
            const teamIds = teams.map(t => t._id);
            query.team = { $in: teamIds };
        }
    } else if (req.user?.role === UserRole.MEMBER) {
        // Regular members see only their team's reports
        const teams = req.user.teams;
        query.team = { $in: teams };
    }
    // Org leaders see all reports (no filter)

    const reports = await ProblemReport.find(query)
        .populate('reportedBy', 'username email')
        .populate('team', 'name')
        .populate('assignedTo', 'username email')
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: reports.length,
        data: reports
    });
});

/**
 * @desc    Get single report
 * @route   GET /api/reports/:id
 * @access  Private
 */
export const getReport = asyncHandlewrapper(async (req: AuthRequest, res: Response) => {
    const report = await ProblemReport.findById(req.params.id)
        .populate('reportedBy', 'username email profilePicture')
        .populate('team', 'name')
        .populate('assignedTo', 'username email');

    if (!report) {
        res.status(404).json({
            success: false,
            error: 'Report not found'
        });
        return;
    }

    res.status(200).json({
        success: true,
        data: report
    });
});

/**
 * @desc    Update report
 * @route   PUT /api/reports/:id
 * @access  Private (reporter + field admin)
 */
export const updateReport = asyncHandlewrapper(async (req: AuthRequest, res: Response) => {
    const { title, description, severity, category } = req.body;

    const report = await ProblemReport.findById(req.params.id);

    if (!report) {
        res.status(404).json({
            success: false,
            error: 'Report not found'
        });
        return;
    }

    // Check if user can update
    const isReporter = report.reportedBy.toString() === req.user?._id.toString();
    const team = await Team.findById(report.team);
    const field = await Field.findById(team?.field);
    const isFieldAdmin = field?.admin.toString() === req.user?._id.toString();

    if (!isReporter && !isFieldAdmin && req.user?.role !== UserRole.ORG_LEADER) {
        res.status(403).json({
            success: false,
            error: 'You do not have permission to update this report'
        });
        return;
    }

    // Update fields
    if (title) report.title = title;
    if (description) report.description = description;
    if (severity) report.severity = severity;
    if (category) report.category = category;

    await report.save();

    res.status(200).json({
        success: true,
        message: 'Report updated successfully',
        data: report
    });
});

/**
 * @desc    Delete report
 * @route   DELETE /api/reports/:id
 * @access  Private (reporter + field admin)
 */
export const deleteReport = asyncHandlewrapper(async (req: AuthRequest, res: Response) => {
    const report = await ProblemReport.findById(req.params.id);

    if (!report) {
        res.status(404).json({
            success: false,
            error: 'Report not found'
        });
        return;
    }

    // Check if user can delete
    const isReporter = report.reportedBy.toString() === req.user?._id.toString();
    const team = await Team.findById(report.team);
    const field = await Field.findById(team?.field);
    const isFieldAdmin = field?.admin.toString() === req.user?._id.toString();

    if (!isReporter && !isFieldAdmin && req.user?.role !== UserRole.ORG_LEADER) {
        res.status(403).json({
            success: false,
            error: 'You do not have permission to delete this report'
        });
        return;
    }

    await report.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Report deleted successfully'
    });
});

/**
 * @desc    Assign report to admin
 * @route   PATCH /api/reports/:id/assign
 * @access  Private (field admin only)
 */
export const assignReport = asyncHandlewrapper(async (req: AuthRequest, res: Response) => {
    const { adminId } = req.body;

    const report = await ProblemReport.findById(req.params.id);

    if (!report) {
        res.status(404).json({
            success: false,
            error: 'Report not found'
        });
        return;
    }

    const team = await Team.findById(report.team);
    const field = await Field.findById(team?.field);

    // Only field admin can assign
    if (field?.admin.toString() !== req.user?._id.toString() && req.user?.role !== UserRole.ORG_LEADER) {
        res.status(403).json({
            success: false,
            error: 'Only field admin can assign reports'
        });
        return;
    }

    report.assignedTo = adminId || req.user?._id;
    await report.save();

    res.status(200).json({
        success: true,
        message: 'Report assigned successfully',
        data: report
    });
});

/**
 * @desc    Update report status
 * @route   PATCH /api/reports/:id/status
 * @access  Private (field admin only)
 */
export const updateReportStatus = asyncHandlewrapper(async (req: AuthRequest, res: Response) => {
    const { status } = req.body;

    if (!status || !Object.values(ProblemStatus).includes(status)) {
        res.status(400).json({
            success: false,
            error: 'Valid status is required'
        });
        return;
    }

    const report = await ProblemReport.findById(req.params.id);

    if (!report) {
        res.status(404).json({
            success: false,
            error: 'Report not found'
        });
        return;
    }

    const team = await Team.findById(report.team);
    const field = await Field.findById(team?.field);

    // Only field admin can update status
    if (field?.admin.toString() !== req.user?._id.toString() && req.user?.role !== UserRole.ORG_LEADER) {
        res.status(403).json({
            success: false,
            error: 'Only field admin can update report status'
        });
        return;
    }

    report.status = status;
    await report.save();

    // Notify reporter of status change
    await Notification.create({
        reciever: report.reportedBy,
        sender: req.user?._id,
        type: NotificationType.ANNOUNCEMENT,
        title: 'Report Status Updated',
        message: `Your report "${report.title}" status changed to ${status}`,
        link: `/reports/${report._id}`,
        priority: Priority.NORMAL
    });

    res.status(200).json({
        success: true,
        message: 'Report status updated successfully',
        data: report
    });
});

/**
 * @desc    Resolve report
 * @route   POST /api/reports/:id/resolve
 * @access  Private (field admin only)
 */
export const resolveReport = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { resolution } = req.body;

    if (!resolution) {
        res.status(400).json({
            success: false,
            error: 'Resolution notes are required'
        });
        return;
    }

    const report = await ProblemReport.findById(req.params.id);

    if (!report) {
        res.status(404).json({
            success: false,
            error: 'Report not found'
        });
        return;
    }

    const team = await Team.findById(report.team);
    const field = await Field.findById(team?.field);

    // Only field admin can resolve
    if (field?.admin.toString() !== req.user?._id.toString() && req.user?.role !== UserRole.ORG_LEADER) {
        res.status(403).json({
            success: false,
            error: 'Only field admin can resolve reports'
        });
        return;
    }

    report.status = ProblemStatus.RESOLVED;
    report.resolution = resolution;
    report.resolvedAt = new Date();

    await report.save();

    // Notify reporter
    await Notification.create({
        recipient: report.reportedBy,
        sender: req.user?._id,
        type: NotificationType.ANNOUNCEMENT,
        title: 'Report Resolved',
        message: `Your report "${report.title}" has been resolved`,
        link: `/reports/${report._id}`,
        priority: Priority.NORMAL
    });

    res.status(200).json({
        success: true,
        message: 'Report resolved successfully',
        data: report
    });
});

/**
 * @desc    Get user's reports
 * @route   GET /api/reports/my-reports
 * @access  Private
 */
export const getMyReports = asyncHandler(async (req: AuthRequest, res: Response) => {
    const reports = await ProblemReport.find({ reportedBy: req.user?._id })
        .populate('team', 'name')
        .populate('assignedTo', 'username email')
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: reports.length,
        data: reports
    });
});

/**
 * @desc    Get reports assigned to current admin
 * @route   GET /api/reports/assigned-to-me
 * @access  Private (field admin only)
 */
export const getAssignedReports = asyncHandler(async (req: AuthRequest, res: Response) => {
    const reports = await ProblemReport.find({ assignedTo: req.user?._id })
        .populate('reportedBy', 'username email')
        .populate('team', 'name')
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: reports.length,
        data: reports
    });
});