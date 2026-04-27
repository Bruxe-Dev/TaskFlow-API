// src/routes/organizationRoutes.ts
import express from 'express';
import { protect, authorize, checkOrganization, isOrgLeader } from '../middleware/auth';
import {
    createOrganization,
    getOrganization,
    updateOrganization,
    deleteOrganization,
    getOrganizationDashboard,
    getOrganizationFields,
    createField,
    getOrganizationStats,
    updateOrganizationSettings
} from '../controllers/organizationController';

const router = express.Router();

// All these should work now
router.post('/', protect, createOrganization);
router.get('/:id', protect, checkOrganization(), getOrganization);
router.put('/:id', protect, checkOrganization(), isOrgLeader, updateOrganization);

export default router;