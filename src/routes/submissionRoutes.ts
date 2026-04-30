import express from "express";
import {
    createSubmission,
    getSubmission,
    getPendingSubmissions,
    reviewSubmission
} from '../controllers/submissionController';

import { protect, isFieldAdmin } from "../middleware/auth";

const router = express.Router();

router.post('/', protect, createSubmission);
router.get('/pending', protect, isFieldAdmin, getPendingSubmissions);
router.get('/:id', protect, getSubmission);
router.post('/:id/review', protect, isFieldAdmin, reviewSubmission);

export default router;