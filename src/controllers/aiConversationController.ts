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

    if (!isMember) {
        res.status(403).json({
            success: false,
            message: "UNAUTHORIZED"
        })
        return;
    }

    let conversation;

    if (conversationId) {
        conversation = await AIConversation.findById(conversationId)
        if (!conversation) {
            res.status(404).json({
                success: false,
                message: "Converstaion Not Found"
            })
            return;
        }
    } else {
        conversation = await AIConversation.create({
            workspace: workspaceId,
            user: req.user?._id,
            messages: [],
            context: {
                project: projectId,
                task: taskId
            }
        })

        workspace.aiConversations.push(conversation._id)
        await workspace.save();
    }

    let contextInfo = '';

    // Add workspace info
    contextInfo += `You are an AI assistant helping a team in their workspace: ${workspace.name}.\n`;
    contextInfo += `Team: ${team.name}\n\n`;

    if (projectId) {
        const project = await Project.findById(projectId);
        if (project) {
            contextInfo += `Current Project: ${project.name}\n`;
            contextInfo += `Project Description: ${project.description || 'No description'}\n`;
            contextInfo += `Project Status: ${project.status}\n`;
            contextInfo += `Deadline: ${project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No deadline'}\n\n`;
        }
    }

    if (taskId) {
        const task = await Task.findById(taskId);
        if (task) {
            contextInfo += `Current Task: ${task.name}\n`;
            contextInfo += `Task Description: ${task.description || 'No description'}\n`;
            contextInfo += `Task Status: ${task.status}\n`;
            contextInfo += `Due Date: ${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}\n\n`;
        }
    }

})