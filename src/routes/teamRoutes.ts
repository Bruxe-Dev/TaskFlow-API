import express from 'express';
import {
    createTeam,
    getTeam,
    updateTeam,
    deleteTeam,
    addTeamMember,
    removeTeamMember,
    updateMemberRole,
    changeTeamLeader,
    getTeamWorkspace,
    getTeamProjects,
    getTeamStats
} from '../controllers/teamController';
import { protect, isFieldAdmin, isTeamLeader } from '../middleware/auth';

const router = express.Router();

// Team CRUD
router.post('/', protect, isFieldAdmin, createTeam);
router.get('/:id', protect, getTeam);
router.put('/:id', protect, isFieldAdmin, isTeamLeader, updateTeam);
router.delete('/:id', protect, isFieldAdmin, deleteTeam);

// Team leader
router.put('/:id/leader', protect, isFieldAdmin, changeTeamLeader);
// Team members
router.post('/:id/members', protect, isFieldAdmin, addTeamMember);
router.delete('/:id/members/:userId', protect, isFieldAdmin, removeTeamMember);
router.put('/:id/members/:userId/role', protect, isFieldAdmin, updateMemberRole);

// Team workspace and projects
router.get('/:id/workspace', protect, getTeamWorkspace);
router.get('/:id/projects', protect, getTeamProjects);
router.get('/:id/stats', protect, getTeamStats);

export default router;