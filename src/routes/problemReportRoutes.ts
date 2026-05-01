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