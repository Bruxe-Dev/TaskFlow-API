import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import asyncHandlewrapper from '../middleware/asyncHandlewrapp';
import { AIConversation, Workspace, Team, Project, Task } from '../models';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
})

/**
 * @desc    Send message to AI assistant
 * @route   POST /api/ai/chat
 * @access  Private (workspace members only)
 */

export const chatWithAI = asyncHandlewrapper(async (req: AuthRequest, res: Response) => {
    const { workspaceId, message, conversationId, projectId, taskId } = req.body;

    if (!message || !workspaceId) {
        res.status(404).json({
            success: false,
            message: "No message and Workspace provided "
        })
        return;
    }
})