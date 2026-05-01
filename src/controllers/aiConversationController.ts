import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import asyncHandlewrapper from '../middleware/asyncHandlewrapp';
import { AIConversation, Workspace, Team, Project, Task } from '../models';
import Anthropic from '@anthropic-ai/sdk';