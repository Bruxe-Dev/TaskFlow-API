import express from 'express'
import {
    createAccessRequest,
    getAccessRequests,
    getAccessRequest,
    updateAccessRequest,
    cancelAccessRequest,
    approveAccessRequest,
    denyAccessRequest,
    getMyRequests,
    getPendingRequests
} from '../controllers/accessRequestController';
import { protect, isFieldAdmin } from '../middleware/auth';

const router = express.Router()

router.post('/', protect, createAccessRequest);
router.get('/', protect, getAccessRequests);
router.get('/my-requests', protect, getMyRequests);
router.get('/pending', protect, isFieldAdmin, getPendingRequests);
router.get('/:id', protect, getAccessRequest);
router.put('/:id', protect, updateAccessRequest);
router.delete('/:id', protect, cancelAccessRequest);

// Approve/Deny
router.post('/:id/approve', protect, isFieldAdmin, approveAccessRequest);
router.post('/:id/deny', protect, isFieldAdmin, denyAccessRequest);

export default router;