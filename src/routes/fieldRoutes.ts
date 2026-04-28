import express from 'express';
import {
    getField,
    updateField,
    deleteField,
    getFieldTeams,
    createTeam,
    getFieldDashboard,
    getFieldStats,
    shareFieldAccess,
    removeFieldAccess
} from '../controllers/fieldController';
import { protect, isFieldAdmin, isOrgLeader } from '../middleware/auth';

const router = express.Router();

// Field management
router.get('/:id', protect, getField);
router.put('/:id', protect, isFieldAdmin, updateField);
router.delete('/:id', protect, isOrgLeader, deleteField);

// Teams in field
router.get('/:id/teams', protect, getFieldTeams);
router.post('/:id/teams', protect, isFieldAdmin, createTeam);

// Dashboard and stats
router.get('/:id/dashboard', protect, isFieldAdmin, getFieldDashboard);
router.get('/:id/stats', protect, isFieldAdmin, getFieldStats);

// Share access
router.post('/:id/share', protect, isFieldAdmin, shareFieldAccess);
router.delete('/:id/share/:adminId', protect, isFieldAdmin, removeFieldAccess);

export default router;