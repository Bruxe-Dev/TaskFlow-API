import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import asyncHandlewrapper from '../middleware/asyncHandlewrapp';
import { Submission, Project, Team, Field, Notification } from '../models';
import { UserRole, SubmissionStatus, NotificationType, Priority } from '../types';

/**
 * @desc    Submit project
 * @route   POST /api/submissions
 * @access  Private (team members only)
 */
export const createSubmission = asyncHandlewrapper(async (req: AuthRequest, res: Response) => {
    const { projectId, content, files } = req.body;

    if (!projectId || !content) {
        res.status(400).json({
            success: false,
            error: 'Project and content are required'
        });
        return;
    }

    const project = await Project.findById(projectId);

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

    // Check if user is a team member
    const isMember = team.members.some(
        (member: any) => member.user.toString() === req.user?._id.toString()
    );

    if (!isMember) {
        res.status(403).json({
            success: false,
            error: 'Only team members can submit projects'
        });
        return;
    }

    // Create submission
    const submission = await Submission.create({
        project: projectId,
        submittedBy: req.user?._id,
        team: team._id,
        content,
        files: files || [],
        status: SubmissionStatus.PENDING
    });

    // Add submission to project
    await Project.findByIdAndUpdate(projectId, {
        $push: { submissions: submission._id }
    });

    // Notify field admin
    const field = await Field.findById(team.field);
    if (field) {
        await Notification.create({
            reciever: field.admin,
            sender: req.user?._id,
            type: NotificationType.SUBMISSION_REVIEWED,
            title: 'New Project Submission',
            message: `Team ${team.name} submitted project: ${project.name}`,
            link: `/submissions/${submission._id}`,
            priority: Priority.HIGH
        });
    }

    const populatedSubmission = await Submission.findById(submission._id)
        .populate('submittedBy', 'username email')
        .populate('project', 'title')
        .populate('team', 'name');

    res.status(201).json({
        success: true,
        message: 'Project submitted successfully',
        data: populatedSubmission
    });
});

/**
 * @desc    Get submission details
 * @route   GET /api/submissions/:id
 * @access  Private
 */
export const getSubmission = asyncHandlewrapper(async (req: AuthRequest, res: Response) => {
    const submission = await Submission.findById(req.params.id)
        .populate('submittedBy', 'username email')
        .populate('project', 'title')
        .populate('team', 'name')
        .populate('reviewedBy', 'username email');

    if (!submission) {
        res.status(404).json({
            success: false,
            error: 'Submission not found'
        });
        return;
    }

    res.status(200).json({
        success: true,
        data: submission
    });
});

/**
 * @desc    Review submission
 * @route   POST /api/submissions/:id/review
 * @access  Private (field admin only)
 */
export const reviewSubmission = asyncHandlewrapper(async (req: AuthRequest, res: Response) => {
    const { status, reviewNotes } = req.body;

    if (!status || ![SubmissionStatus.APPROVED, SubmissionStatus.REJECTED, SubmissionStatus.REVISION_REQUESTED].includes(status)) {
        res.status(400).json({
            success: false,
            error: 'Valid review status is required'
        });
        return;
    }

    const submission = await Submission.findById(req.params.id);

    if (!submission) {
        res.status(404).json({
            success: false,
            error: 'Submission not found'
        });
        return;
    }

    const team = await Team.findById(submission.team);
    const field = await Field.findById(team?.field);

    // Only field admin can review
    if (field?.admin.toString() !== req.user?._id.toString() && req.user?.role !== UserRole.ORG_LEADER) {
        res.status(403).json({
            success: false,
            error: 'Only the field admin can review submissions'
        });
        return;
    }

    submission.status = status;
    submission.reviewedBy = req.user?._id;
    submission.reviewNotes = reviewNotes;
    submission.reviewedAt = new Date();

    await submission.save();

    // Notify submitter
    await Notification.create({
        reciever: submission.submittedBy,
        sender: req.user?._id,
        type: NotificationType.SUBMISSION_REVIEWED,
        title: 'Submission Reviewed',
        message: `Your submission has been ${status}`,
        link: `/submissions/${submission._id}`,
        priority: Priority.HIGH
    });

    const updatedSubmission = await Submission.findById(submission._id)
        .populate('reviewedBy', 'username email');

    res.status(200).json({
        success: true,
        message: 'Submission reviewed successfully',
        data: updatedSubmission
    });
});

/**
 * @desc    Get pending submissions
 * @route   GET /api/submissions/pending
 * @access  Private (field admin only)
 */
export const getPendingSubmissions = asyncHandlewrapper(async (req: AuthRequest, res: Response) => {
    // Get field admin's field
    const field = await Field.findOne({ admin: req.user?._id });

    if (!field && req.user?.role !== UserRole.ORG_LEADER) {
        res.status(403).json({
            success: false,
            error: 'Only field admins can view pending submissions'
        });
        return;
    }

    // Get teams in this field
    const teams = await Team.find({ field: field?._id });
    const teamIds = teams.map(t => t._id);

    // Get pending submissions from these teams
    const submissions = await Submission.find({
        team: { $in: teamIds },
        status: SubmissionStatus.PENDING
    })
        .populate('submittedBy', 'username email')
        .populate('project', 'title')
        .populate('team', 'name')
        .sort({ submittedAt: -1 });

    res.status(200).json({
        success: true,
        count: submissions.length,
        data: submissions
    });
});