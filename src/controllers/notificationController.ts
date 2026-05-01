import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import asyncHandlewrapper from '../middleware/asyncHandlewrapp';
import { Notification, User, Team, Field } from '../models';
import { UserRole, NotificationType, Priority } from '../types';

/**
 * @desc    Get user's notifications
 * @route   GET /api/notifications
 * @access  Private
 */
export const getNotifications = asyncHandlewrapper(async (req: AuthRequest, res: Response) => {
    const { unreadOnly, limit = 50 } = req.query;

    const query: any = { recipient: req.user?._id };

    if (unreadOnly === 'true') {
        query.read = false;
    }

    const notifications = await Notification.find(query)
        .populate('sender', 'username email profilePicture')
        .sort({ createdAt: -1 })
        .limit(Number(limit));

    const unreadCount = await Notification.countDocuments({
        recipient: req.user?._id,
        read: false
    });

    res.status(200).json({
        success: true,
        count: notifications.length,
        unreadCount,
        data: notifications
    });
});

/**
 * @desc    Get single notification
 * @route   GET /api/notifications/:id
 * @access  Private
 */
export const getNotification = asyncHandlewrapper(async (req: AuthRequest, res: Response) => {
    const notification = await Notification.findById(req.params.id)
        .populate('sender', 'username email profilePicture');

    if (!notification) {
        res.status(404).json({
            success: false,
            error: 'Notification not found'
        });
        return;
    }

    // Check if notification belongs to user
    if (notification.reciever.toString() !== req.user?._id.toString()) {
        res.status(403).json({
            success: false,
            error: 'You do not have access to this notification'
        });
        return;
    }

    res.status(200).json({
        success: true,
        data: notification
    });
});

/**
 * @desc    Mark notification as read
 * @route   PATCH /api/notifications/:id/read
 * @access  Private
 */
export const markAsRead = asyncHandlewrapper(async (req: AuthRequest, res: Response) => {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
        res.status(404).json({
            success: false,
            error: 'Notification not found'
        });
        return;
    }

    // Check if notification belongs to user
    if (notification.reciever.toString() !== req.user?._id.toString()) {
        res.status(403).json({
            success: false,
            error: 'You do not have access to this notification'
        });
        return;
    }

    notification.read = true;
    await notification.save();

    res.status(200).json({
        success: true,
        message: 'Notification marked as read',
        data: notification
    });
});

/**
 * @desc    Mark all notifications as read
 * @route   PATCH /api/notifications/read-all
 * @access  Private
 */
export const markAllAsRead = asyncHandlewrapper(async (req: AuthRequest, res: Response) => {
    const result = await Notification.updateMany(
        { recipient: req.user?._id, read: false },
        { read: true }
    );

    res.status(200).json({
        success: true,
        message: `Marked ${result.modifiedCount} notifications as read`,
        modifiedCount: result.modifiedCount
    });
});

/**
 * @desc    Delete notification
 * @route   DELETE /api/notifications/:id
 * @access  Private
 */
export const deleteNotification = asyncHandlewrapper(async (req: AuthRequest, res: Response) => {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
        res.status(404).json({
            success: false,
            error: 'Notification not found'
        });
        return;
    }

    // Check if notification belongs to user
    if (notification.reciever.toString() !== req.user?._id.toString()) {
        res.status(403).json({
            success: false,
            error: 'You do not have access to this notification'
        });
        return;
    }

    await notification.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Notification deleted successfully'
    });
});

/**
 * @desc    Clear all notifications
 * @route   DELETE /api/notifications/clear-all
 * @access  Private
 */
export const clearAllNotifications = asyncHandlewrapper(async (req: AuthRequest, res: Response) => {
    const result = await Notification.deleteMany({ recipient: req.user?._id });

    res.status(200).json({
        success: true,
        message: `Cleared ${result.deletedCount} notifications`,
        deletedCount: result.deletedCount
    });
});

/**
 * @desc    Send broadcast notification
 * @route   POST /api/notifications/broadcast
 * @access  Private (field admin + org leader)
 */
export const broadcastNotification = asyncHandlewrapper(async (req: AuthRequest, res: Response) => {
    const { title, message, targetType, targetId, priority } = req.body;

    if (!title || !message || !targetType) {
        res.status(400).json({
            success: false,
            error: 'Title, message, and target type are required'
        });
        return;
    }

    let recipients: any[] = [];

    // Determine recipients based on target type
    if (targetType === 'team' && targetId) {
        const team = await Team.findById(targetId);
        if (!team) {
            res.status(404).json({
                success: false,
                error: 'Team not found'
            });
            return;
        }

        // Check if user can broadcast to this team
        const field = await Field.findById(team.field);
        if (field?.admin.toString() !== req.user?._id.toString() && req.user?.role !== UserRole.ORG_LEADER) {
            res.status(403).json({
                success: false,
                error: 'You do not have permission to broadcast to this team'
            });
            return;
        }

        recipients = team.members.map((m: any) => m.user);

    } else if (targetType === 'field' && targetId) {
        const field = await Field.findById(targetId);
        if (!field) {
            res.status(404).json({
                success: false,
                error: 'Field not found'
            });
            return;
        }

        // Check if user can broadcast to this field
        if (field.admin.toString() !== req.user?._id.toString() && req.user?.role !== UserRole.ORG_LEADER) {
            res.status(403).json({
                success: false,
                error: 'You do not have permission to broadcast to this field'
            });
            return;
        }

        // Get all users in this field
        recipients = await User.find({ field: field._id }).select('_id');
        recipients = recipients.map((u: any) => u._id);

    } else if (targetType === 'organization' && req.user?.role === UserRole.ORG_LEADER) {
        // Only org leader can broadcast to entire organization
        const orgMembers = await User.find({ organization: req.user.organization }).select('_id');
        recipients = orgMembers.map((u: any) => u._id);

    } else {
        res.status(400).json({
            success: false,
            error: 'Invalid target type or insufficient permissions'
        });
        return;
    }

    // Create notifications for all recipients
    const notifications = recipients.map((recipientId: any) => ({
        recipient: recipientId,
        sender: req.user?._id,
        type: NotificationType.ANNOUNCEMENT,
        title,
        message,
        priority: priority || Priority.LOW
    }));

    await Notification.insertMany(notifications);

    res.status(201).json({
        success: true,
        message: `Broadcast sent to ${recipients.length} users`,
        recipientCount: recipients.length
    });
});

/**
 * @desc    Get unread notification count
 * @route   GET /api/notifications/unread-count
 * @access  Private
 */
export const getUnreadCount = asyncHandlewrapper(async (req: AuthRequest, res: Response) => {
    const count = await Notification.countDocuments({
        recipient: req.user?._id,
        read: false
    });

    res.status(200).json({
        success: true,
        count
    });
});