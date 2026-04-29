import express from 'express';
import {
    getWorkspace,
    updateWorkspace,
    getWorkspaceProjects,
    getWorkspaceUpdates,
    postWorkspaceUpdate,
    getWorkspaceMembers,
    updateWorkspaceSettings
} from '../controllers/workspaceController';
import { protect } from '../middleware/auth';

const router = express.Router();

// Workspace details
router.get('/:id', protect, getWorkspace);
router.put('/:id', protect, updateWorkspace);

// Workspace content
router.get('/:id/projects', protect, getWorkspaceProjects);
router.get('/:id/updates', protect, getWorkspaceUpdates);
router.post('/:id/updates', protect, postWorkspaceUpdate);

// Workspace members
router.get('/:id/members', protect, getWorkspaceMembers);

// Workspace settings
router.put('/:id/settings', protect, updateWorkspaceSettings);

export default router;