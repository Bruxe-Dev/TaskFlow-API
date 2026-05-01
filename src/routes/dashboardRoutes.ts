import express from 'express';
import {
    getOrgLeaderDashboard,
    getFieldAdminDashboard,
    getTeamMemberDashboard,
    getAnalytics
} from '../controllers/dashboardController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.get('/org-leader', protect, getOrgLeaderDashboard);
router.get('/field-admin', protect, getFieldAdminDashboard);
router.get('/team-member', protect, getTeamMemberDashboard);
router.get('/analytics', protect, getAnalytics);

export default router;