import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import asyncHandlewrapper from '../middleware/asyncHandlewrapp';
import { Notification, User, Team, Field } from '../models';
import { UserRole, NotificationType, Priority } from '../types';
import { ResolveFnOutput } from 'node:module';

/**
 * @desc Get Users Notifications
 * @route GET /api/notifications
 * @access Private
 */

export const getNotifications = asyncHandlewrapper(async (req: AuthRequest, res: Response) => {
    const { unreadOnly, limit = 20 } = req.query;

    const query: any = { reciever: req.user?._id };

    if (unreadOnly === 'true') {
        query.read = false
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