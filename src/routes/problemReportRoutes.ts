import express from 'express';
import {
    createProblemReport,
    getReports,
    getReport,
    updateReport,
    deleteReport,
    assignReport,
    updateReportStatus,
    resolveReport,
    getMyReports,
    getAssignedReports
} from '../controllers/problemReportController';
import { protect, isFieldAdmin } from '../middleware/auth';

const router = express.Router();

// CRUD
router.post('/', protect, createProblemReport);
router.get('/', protect, getReports);
router.get('/my-reports', protect, getMyReports);
router.get('/assigned-to-me', protect, isFieldAdmin, getAssignedReports);
router.get('/:id', protect, getReport);
router.put('/:id', protect, updateReport);
router.delete('/:id', protect, deleteReport);

// Admin actions
router.patch('/:id/assign', protect, isFieldAdmin, assignReport);
router.patch('/:id/status', protect, isFieldAdmin, updateReportStatus);
router.post('/:id/resolve', protect, isFieldAdmin, resolveReport);

export default router;