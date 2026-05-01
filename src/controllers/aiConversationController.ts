import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import asyncHandlewrapper from '../middleware/asyncHandlewrapp';
import { AIConversation, Workspace, Team, Project, Task } from '../models';
import Anthropic from '@anthropic-ai/sdk';
import { getWorkspaceProjects } from './workspaceController';

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

    const workspace = await Workspace.findById(workspaceId)
    if (!workspace) {
        res.status(404).json({
            success: false,
            message: "Workspace Not Found"
        })
        return
    }

    if (!workspace.aiAssistantEnabled) {
        res.status(404).json({
            success: false,
            message: "AI Assistant is Disabled for this Workspace"
        })
        return;
    }

    const team = await Team.findById(workspace.team)
    if (!team) {
        res.status(404).json({
            success: false,
            message: "Team Not Found"
        })
        return;
    }

    const isMember = team.members.some(
        (member: any) => member.user.toString() === req.user?._id.toString()
    )
})