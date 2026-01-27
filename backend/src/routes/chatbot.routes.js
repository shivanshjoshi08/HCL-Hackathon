import express from 'express';
import { getConfig, chat } from '../controllers/chatbot.controller.js';

const router = express.Router();

// GET /api/chatbot/config - Get bot configuration
router.get('/config', getConfig);

// POST /api/chatbot/chat - Send message to chatbot
router.post('/chat', chat);

export default router;
