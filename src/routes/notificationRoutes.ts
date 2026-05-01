import express from 'express';
import {
    getNotifications,
    getNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    broadcastNotification,
    getUnreadCount
} from '../controllers/notificationController';
import { protect, authorize } from '../middleware/auth';
import { UserRole } from '../types';

const router = express.Router();

// Get notifications
router.get('/', protect, getNotifications);
router.get('/unread-count', protect, getUnreadCount);
router.get('/:id', protect, getNotification);

// Mark as read
router.patch('/:id/read', protect, markAsRead);
router.patch('/read-all', protect, markAllAsRead);

// Delete notifications
router.delete('/:id', protect, deleteNotification);
router.delete('/clear-all', protect, clearAllNotifications);

// Broadcast (admin only)
router.post('/broadcast', protect, authorize(UserRole.FIELD_ADMIN, UserRole.ORG_LEADER), broadcastNotification);

export default router;