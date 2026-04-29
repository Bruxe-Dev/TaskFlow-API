import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import asyncHandlewrapper from '../middleware/asyncHandlewrapp';
import { Workspace, Team, Project, Update, User } from '../models';
import { UserRole } from '../types';

/**
 * @desc Get Workspace details
 * @route GET /api/workspaces/:id
 * @access Private (Only team Members can access this)
 */