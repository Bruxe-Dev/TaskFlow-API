import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import asyncHandlewrapper from '../middleware/asyncHandlewrapp';
import { Notification, User, Team, Field } from '../models';
import { UserRole, NotificationType, Priority } from '../types';