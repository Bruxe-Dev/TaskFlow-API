import express from 'express';
import {
    chatWithAI,
    getWorkspaceConversations,
    getConversation,
    deleteConversation,
    continueConversation,
    getTaskSuggestions,
    getProjectSuggestions
} from '../controllers/aiConversationController';
import { protect } from '../middleware/auth';

const router = express.Router();

// Chat
router.post('/chat', protect, chatWithAI);

// Conversations
router.get('/conversations/:workspaceId', protect, getWorkspaceConversations);
router.get('/conversation/:id', protect, getConversation);
router.get('/conversations/:id', protect, getConversation);
router.delete('/conversations/:id', protect, deleteConversation);
router.post('/conversations/:id/continue', protect, continueConversation);

// Suggestions
router.get('/suggestions/task/:taskId', protect, getTaskSuggestions);
router.get('/suggestions/project/:projectId', protect, getProjectSuggestions);

export default router;
