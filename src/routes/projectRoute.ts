import express from 'express';
import {
    createProject,
    getProject,
    updateProject,
    deleteProject,
    updateProjectStatus,
    getProjectTasks,
    createProjectTask,
    getProjectStats,
    getProjectsByWorkspace
} from '../controllers/projectController';
import { protect, isFieldAdmin } from '../middleware/auth';

const router = express.Router();

// Project CRUD
router.post('/', protect, isFieldAdmin, createProject);
router.get('/:id', protect, getProject);
router.put('/:id', protect, isFieldAdmin, updateProject);
router.delete('/:id', protect, isFieldAdmin, deleteProject);

// Project status
router.patch('/:id/status', protect, updateProjectStatus);

// Project tasks
router.get('/:id/tasks', protect, getProjectTasks);
router.post('/:id/tasks', protect, isFieldAdmin, createProjectTask);

// Project stats
router.get('/:id/stats', protect, getProjectStats);

// Get projects by workspace
router.get('/workspace/:workspaceId', protect, getProjectsByWorkspace);

export default router;