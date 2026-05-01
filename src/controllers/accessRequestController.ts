import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import asyncHandlewrapper from '../middleware/asyncHandlewrapp';
import { AccessRequest, Field, User, Notification } from '../models';
import { UserRole, AccessStatus, NotificationType, Priority } from '../types';

/**
 * @desc    Create access request
 * @route   POST /api/access-requests
 * @access  Private (any member)
 */
export const createAccessRequest = asyncHandlewrapper(async (req: AuthRequest, res: Response) => {
    const { targetFieldId, targetWorkspaceId, reason } = req.body;

    if (!targetFieldId || !reason) {
        res.status(400).json({
            success: false,
            error: 'Target field and reason are required'
        });
        return;
    }

    if (reason.length < 20) {
        res.status(400).json({
            success: false,
            error: 'Reason must be at least 20 characters'
        });
        return;
    }

    const targetField = await Field.findById(targetFieldId);

    if (!targetField) {
        res.status(404).json({
            success: false,
            error: 'Target field not found'
        });
        return;
    }

    // Check if user already has an active request for this field
    const existingRequest = await AccessRequest.findOne({
        requester: req.user?._id,
        targetField: targetFieldId,
        status: AccessRequestStatus.PENDING
    });

    if (existingRequest) {
        res.status(400).json({
            success: false,
            error: 'You already have a pending request for this field'
        });
        return;
    }

    // Create access request
    const accessRequest = await AccessRequest.create({
        requester: req.user?._id,
        targetField: targetFieldId,
        targetWorkspace: targetWorkspaceId,
        reason,
        status: AccessRequestStatus.PENDING
    });

    // Notify field admin
    await Notification.create({
        recipient: targetField.admin,
        sender: req.user?._id,
        type: NotificationType.ACCESS_GRANTED,
        title: 'New Access Request',
        message: `${req.user?.username} requested access to your field`,
        link: `/access-requests/${accessRequest._id}`,
        priority: Priority.NORMAL
    });

    const populatedRequest = await AccessRequest.findById(accessRequest._id)
        .populate('requester', 'username email')
        .populate('targetField', 'name');

    res.status(201).json({
        success: true,
        message: 'Access request submitted successfully',
        data: populatedRequest
    });
});

/**
 * @desc    Get access requests (filtered by role)
 * @route   GET /api/access-requests
 * @access  Private
 */
export const getAccessRequests = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { status } = req.query;

    let query: any = {};

    if (status) {
        query.status = status;
    }

    // Role-based filtering
    if (req.user?.role === UserRole.FIELD_ADMIN) {
        // Field admin sees requests for their field
        const field = await Field.findOne({ admin: req.user._id });
        if (field) {
            query.targetField = field._id;
        }
    } else if (req.user?.role === UserRole.MEMBER) {
        // Regular members see only their own requests
        query.requester = req.user._id;
    }
    // Org leaders see all

    const requests = await AccessRequest.find(query)
        .populate('requester', 'username email')
        .populate('targetField', 'name')
        .populate('approvedBy', 'username email')
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: requests.length,
        data: requests
    });
});

/**
 * @desc    Get single access request
 * @route   GET /api/access-requests/:id
 * @access  Private
 */
export const getAccessRequest = asyncHandler(async (req: AuthRequest, res: Response) => {
    const request = await AccessRequest.findById(req.params.id)
        .populate('requester', 'username email profilePicture')
        .populate('targetField', 'name description')
        .populate('approvedBy', 'username email');

    if (!request) {
        res.status(404).json({
            success: false,
            error: 'Access request not found'
        });
        return;
    }

    res.status(200).json({
        success: true,
        data: request
    });
});

/**
 * @desc    Update access request
 * @route   PUT /api/access-requests/:id
 * @access  Private (requester only if pending)
 */
export const updateAccessRequest = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { reason } = req.body;

    const request = await AccessRequest.findById(req.params.id);

    if (!request) {
        res.status(404).json({
            success: false,
            error: 'Access request not found'
        });
        return;
    }

    // Only requester can update their own pending requests
    if (request.requester.toString() !== req.user?._id.toString()) {
        res.status(403).json({
            success: false,
            error: 'You can only update your own requests'
        });
        return;
    }

    if (request.status !== AccessRequestStatus.PENDING) {
        res.status(400).json({
            success: false,
            error: 'Only pending requests can be updated'
        });
        return;
    }

    if (reason) request.reason = reason;

    await request.save();

    res.status(200).json({
        success: true,
        message: 'Access request updated successfully',
        data: request
    });
});

/**
 * @desc    Cancel access request
 * @route   DELETE /api/access-requests/:id
 * @access  Private (requester only)
 */
export const cancelAccessRequest = asyncHandler(async (req: AuthRequest, res: Response) => {
    const request = await AccessRequest.findById(req.params.id);

    if (!request) {
        res.status(404).json({
            success: false,
            error: 'Access request not found'
        });
        return;
    }

    // Only requester can cancel
    if (request.requester.toString() !== req.user?._id.toString()) {
        res.status(403).json({
            success: false,
            error: 'You can only cancel your own requests'
        });
        return;
    }

    await request.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Access request cancelled successfully'
    });
});

/**
 * @desc    Approve access request
 * @route   POST /api/access-requests/:id/approve
 * @access  Private (field admin only)
 */
export const approveAccessRequest = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { approvalNotes, expiresInDays } = req.body;

    const request = await AccessRequest.findById(req.params.id);

    if (!request) {
        res.status(404).json({
            success: false,
            error: 'Access request not found'
        });
        return;
    }

    const field = await Field.findById(request.targetField);

    if (!field) {
        res.status(404).json({
            success: false,
            error: 'Field not found'
        });
        return;
    }

    // Only field admin can approve
    if (field.admin.toString() !== req.user?._id.toString() && req.user?.role !== UserRole.ORG_LEADER) {
        res.status(403).json({
            success: false,
            error: 'Only the field admin can approve access requests'
        });
        return;
    }

    request.status = AccessRequestStatus.APPROVED;
    request.approvedBy = req.user?._id;
    request.approvalNotes = approvalNotes;
    request.processedAt = new Date();

    // Set expiration if provided
    if (expiresInDays) {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + expiresInDays);
        request.expiresAt = expirationDate;
    }

    await request.save();

    // Grant access by adding user to shared admins (or implement your access logic)
    // For now, we'll just notify the user

    // Notify requester
    await Notification.create({
        recipient: request.requester,
        sender: req.user?._id,
        type: NotificationType.ACCESS_GRANTED,
        title: 'Access Request Approved',
        message: `Your access request to ${field.name} has been approved`,
        link: `/fields/${field._id}`,
        priority: Priority.HIGH
    });

    res.status(200).json({
        success: true,
        message: 'Access request approved successfully',
        data: request
    });
});

/**
 * @desc    Deny access request
 * @route   POST /api/access-requests/:id/deny
 * @access  Private (field admin only)
 */
export const denyAccessRequest = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { approvalNotes } = req.body;

    const request = await AccessRequest.findById(req.params.id);

    if (!request) {
        res.status(404).json({
            success: false,
            error: 'Access request not found'
        });
        return;
    }

    const field = await Field.findById(request.targetField);

    if (!field) {
        res.status(404).json({
            success: false,
            error: 'Field not found'
        });
        return;
    }

    // Only field admin can deny
    if (field.admin.toString() !== req.user?._id.toString() && req.user?.role !== UserRole.ORG_LEADER) {
        res.status(403).json({
            success: false,
            error: 'Only the field admin can deny access requests'
        });
        return;
    }

    request.status = AccessRequestStatus.DENIED;
    request.approvedBy = req.user?._id;
    request.approvalNotes = approvalNotes;
    request.processedAt = new Date();

    await request.save();

    // Notify requester
    await Notification.create({
        recipient: request.requester,
        sender: req.user?._id,
        type: NotificationType.ACCESS_DENIED,
        title: 'Access Request Denied',
        message: `Your access request to ${field.name} has been denied`,
        link: `/access-requests/${request._id}`,
        priority: Priority.NORMAL
    });

    res.status(200).json({
        success: true,
        message: 'Access request denied',
        data: request
    });
});

/**
 * @desc    Get user's own requests
 * @route   GET /api/access-requests/my-requests
 * @access  Private
 */
export const getMyRequests = asyncHandler(async (req: AuthRequest, res: Response) => {
    const requests = await AccessRequest.find({ requester: req.user?._id })
        .populate('targetField', 'name')
        .populate('approvedBy', 'username email')
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: requests.length,
        data: requests
    });
});

/**
 * @desc    Get pending requests (field admin)
 * @route   GET /api/access-requests/pending
 * @access  Private (field admin only)
 */
export const getPendingRequests = asyncHandler(async (req: AuthRequest, res: Response) => {
    const field = await Field.findOne({ admin: req.user?._id });

    if (!field && req.user?.role !== UserRole.ORG_LEADER) {
        res.status(403).json({
            success: false,
            error: 'Only field admins can view pending requests'
        });
        return;
    }

    const requests = await AccessRequest.find({
        targetField: field?._id,
        status: AccessRequestStatus.PENDING
    })
        .populate('requester', 'username email profilePicture')
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: requests.length,
        data: requests
    });
});