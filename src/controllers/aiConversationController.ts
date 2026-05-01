import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import asyncHandlewrapper from '../middleware/asyncHandlewrapp';
import { AIConversation, Workspace, Team, Project, Task } from '../models';
import Anthropic from '@anthropic-ai/sdk';

// Initialize Anthropic client
const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
});

/**
 * @desc    Send message to AI assistant
 * @route   POST /api/ai/chat
 * @access  Private (workspace members only)
 */
export const chatWithAI = asyncHandlewrapper(async (req: AuthRequest, res: Response) => {
    const { workspaceId, message, conversationId, projectId, taskId } = req.body;

    if (!workspaceId || !message) {
        res.status(400).json({
            success: false,
            error: 'Workspace ID and message are required'
        });
        return;
    }

    // Verify workspace exists
    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
        res.status(404).json({
            success: false,
            error: 'Workspace not found'
        });
        return;
    }

    // Check if AI is enabled for this workspace
    if (!workspace.aiAssistantEnabled) {
        res.status(403).json({
            success: false,
            error: 'AI assistant is disabled for this workspace'
        });
        return;
    }

    // Check if user is a team member
    const team = await Team.findById(workspace.team);

    if (!team) {
        res.status(404).json({
            success: false,
            error: 'Team not found'
        });
        return;
    }

    const isMember = team.members.some(
        (member: any) => member.user.toString() === req.user?._id.toString()
    );

    if (!isMember) {
        res.status(403).json({
            success: false,
            error: 'Only team members can use the AI assistant'
        });
        return;
    }

    let conversation;

    // Get or create conversation
    if (conversationId) {
        conversation = await AIConversation.findById(conversationId);
        if (!conversation) {
            res.status(404).json({
                success: false,
                error: 'Conversation not found'
            });
            return;
        }
    } else {
        // Create new conversation
        conversation = await AIConversation.create({
            workspace: workspaceId,
            user: req.user?._id,
            messages: [],
            context: {
                project: projectId,
                task: taskId
            }
        });

        // Add conversation to workspace
        workspace.aiConversations.push(conversation._id);
        await workspace.save();
    }

    // Build context for AI
    let contextInfo = '';

    // Add workspace info
    contextInfo += `You are an AI assistant helping a team in their workspace: ${workspace.name}.\n`;
    contextInfo += `Team: ${team.name}\n\n`;

    // Add project context if provided
    if (projectId) {
        const project = await Project.findById(projectId);
        if (project) {
            contextInfo += `Current Project: ${project.name}\n`;
            contextInfo += `Project Description: ${project.description || 'No description'}\n`;
            contextInfo += `Project Status: ${project.status}\n`;
            contextInfo += `Deadline: ${project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No deadline'}\n\n`;
        }
    }

    // Add task context if provided
    if (taskId) {
        const task = await Task.findById(taskId);
        if (task) {
            contextInfo += `Current Task: ${task.name}\n`;
            contextInfo += `Task Description: ${task.description || 'No description'}\n`;
            contextInfo += `Task Status: ${task.status}\n`;
            contextInfo += `Due Date: ${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}\n\n`;
        }
    }

    // Build conversation history for Claude
    const conversationHistory = conversation.messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content
    }));

    // Add user message to conversation
    conversation.messages.push({
        role: 'user',
        content: message,
        timestamp: new Date()
    });

    try {
        // Call Claude API
        const response = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1024,
            system: `${contextInfo}You are a helpful AI assistant for a project management team. Help them with:
                - Task breakdown and planning
                - Problem-solving
                - Code assistance
                - Best practices
                - Time management
                - Team collaboration tips

                Be concise, practical, and actionable. Focus on helping the team succeed.`,
            messages: [
                ...conversationHistory,
                { role: 'user', content: message }
            ]
        });

        // Extract AI response
        const aiMessage = response.content[0].type === 'text' ? response.content[0].text : 'Sorry, I could not generate a response.';

        // Add AI response to conversation
        conversation.messages.push({
            role: 'assistant',
            content: aiMessage,
            timestamp: new Date()
        });

        conversation.lastMessageAt = new Date();
        await conversation.save();

        res.status(200).json({
            success: true,
            data: {
                conversationId: conversation._id,
                message: aiMessage,
                timestamp: new Date()
            }
        });

    } catch (error: any) {
        console.error('AI Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get AI response. Please try again.'
        });
    }
});

/**
 * @desc    Get workspace conversations
 * @route   GET /api/ai/conversations/:workspaceId
 * @access  Private (workspace members only)
 */
export const getWorkspaceConversations = asyncHandlewrapper(async (req: AuthRequest, res: Response) => {
    const workspace = await Workspace.findById(req.params.workspaceId);

    if (!workspace) {
        res.status(404).json({
            success: false,
            error: 'Workspace not found'
        });
        return;
    }

    // Check access
    const team = await Team.findById(workspace.team);

    if (!team) {
        res.status(404).json({
            success: false,
            error: 'Team not found'
        });
        return;
    }

    const isMember = team.members.some(
        (member: any) => member.user.toString() === req.user?._id.toString()
    );

    if (!isMember) {
        res.status(403).json({
            success: false,
            error: 'You do not have access to this workspace'
        });
        return;
    }

    const conversations = await AIConversation.find({
        workspace: workspace._id
    })
        .populate('user', 'username email')
        .sort({ lastMessageAt: -1 })
        .limit(20);

    res.status(200).json({
        success: true,
        count: conversations.length,
        data: conversations
    });
});

/**
 * @desc    Get single conversation
 * @route   GET /api/ai/conversations/:id
 * @access  Private
 */
export const getConversation = asyncHandlewrapper(async (req: AuthRequest, res: Response) => {
    const conversation = await AIConversation.findById(req.params.id)
        .populate('user', 'username email')
        .populate('context.project', 'title')
        .populate('context.task', 'title');

    if (!conversation) {
        res.status(404).json({
            success: false,
            error: 'Conversation not found'
        });
        return;
    }

    res.status(200).json({
        success: true,
        data: conversation
    });
});

/**
 * @desc    Delete conversation
 * @route   DELETE /api/ai/conversations/:id
 * @access  Private
 */
export const deleteConversation = asyncHandlewrapper(async (req: AuthRequest, res: Response) => {
    const conversation = await AIConversation.findById(req.params.id);

    if (!conversation) {
        res.status(404).json({
            success: false,
            error: 'Conversation not found'
        });
        return;
    }

    // Only owner can delete
    if (conversation.user.toString() !== req.user?._id.toString()) {
        res.status(403).json({
            success: false,
            error: 'You can only delete your own conversations'
        });
        return;
    }

    // Remove from workspace
    await Workspace.findByIdAndUpdate(conversation.workspace, {
        $pull: { aiConversations: conversation._id }
    });

    await conversation.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Conversation deleted successfully'
    });
});

/**
 * @desc    Continue conversation
 * @route   POST /api/ai/conversations/:id/continue
 * @access  Private
 */
export const continueConversation = asyncHandlewrapper(async (req: AuthRequest, res: Response) => {
    const { message } = req.body;

    if (!message) {
        res.status(400).json({
            success: false,
            error: 'Message is required'
        });
        return;
    }

    const conversation = await AIConversation.findById(req.params.id);

    if (!conversation) {
        res.status(404).json({
            success: false,
            error: 'Conversation not found'
        });
        return;
    }

    // Use the chat endpoint with existing conversation
    req.body.workspaceId = conversation.workspace.toString();
    req.body.conversationId = conversation._id.toString();
    req.body.projectId = conversation.context?.project?.toString();
    req.body.taskId = conversation.context?.task?.toString();

    return chatWithAI(req, res);
});

/**
 * @desc    Get AI task suggestions
 * @route   GET /api/ai/suggestions/task/:taskId
 * @access  Private
 */
export const getTaskSuggestions = asyncHandlewrapper(async (req: AuthRequest, res: Response) => {
    const task = await Task.findById(req.params.taskId)
        .populate('project', 'title description');

    if (!task) {
        res.status(404).json({
            success: false,
            error: 'Task not found'
        });
        return;
    }

    try {
        const response = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 512,
            messages: [{
                role: 'user',
                content: `Given this task:
            Title: ${task.name}
            Description: ${task.description || 'No description'}
            Status: ${task.status}

Provide 3-5 actionable suggestions to help complete this task efficiently. Be brief and practical.`
            }]
        });

        const suggestions = response.content[0].type === 'text' ? response.content[0].text : '';

        res.status(200).json({
            success: true,
            data: {
                task: {
                    title: task.name,
                    status: task.status
                },
                suggestions
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to generate suggestions'
        });
    }
});

/**
 * @desc    Get AI project suggestions
 * @route   GET /api/ai/suggestions/project/:projectId
 * @access  Private
 */
export const getProjectSuggestions = asyncHandlewrapper(async (req: AuthRequest, res: Response) => {
    const project = await Project.findById(req.params.projectId)
        .populate('tasks');

    if (!project) {
        res.status(404).json({
            success: false,
            error: 'Project not found'
        });
        return;
    }

    try {
        const response = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 512,
            messages: [{
                role: 'user',
                content: `Given this project:
                Title: ${project.name}
                Description: ${project.description || 'No description'}
                Status: ${project.status}
                Progress: ${project.progress}%
                Number of tasks: ${project.tasks.length}
                Deadline: ${project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No deadline'}

                Provide 3-5 actionable suggestions to help this project succeed. Focus on planning, organization, and delivery.`
            }]
        });

        const suggestions = response.content[0].type === 'text' ? response.content[0].text : '';

        res.status(200).json({
            success: true,
            data: {
                project: {
                    title: project.name,
                    status: project.status,
                    progress: project.progress
                },
                suggestions
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to generate suggestions'
        });
    }
});