// dependencies
import express from 'express';
const router = express.Router();
import { verifyAuth } from '../middlewares/auth.middleware.js';

// controller logic
import { getContentByPrompt } from '../controllers/content.controller.js';

// route paths
router.post('/prompt', verifyAuth, getContentByPrompt);

export default router;
