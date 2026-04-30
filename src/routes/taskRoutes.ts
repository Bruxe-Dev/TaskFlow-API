import express from 'express';
import {
    getTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    toggleTaskCompletion,
    addTaskAttachment,
    removeTaskAttachment,
    getTasksByProject,
    getMyAssignedTasks,
    getOverdueTasks,
    getUpcomingTasks
} from '../controllers/taskController';
import { protect, isFieldAdmin } from '../middleware/auth';

const router = express.Router();

// Task CRUD
router.get('/:id', protect, getTask);
router.put('/:id', protect, updateTask);
router.delete('/:id', protect, isFieldAdmin, deleteTask);

// Task status
router.patch('/:id/status', protect, updateTaskStatus);
router.patch('/:id/complete', protect, toggleTaskCompletion);

// Task attachments
router.post('/:id/attachments', protect, addTaskAttachment);
router.delete('/:id/attachments/:attachmentId', protect, removeTaskAttachment);

// Get tasks
router.get('/project/:projectId', protect, getTasksByProject);
router.get('/user/assigned', protect, getMyAssignedTasks);
router.get('/overdue/list', protect, getOverdueTasks);
router.get('/upcoming/week', protect, getUpcomingTasks);

export default router;