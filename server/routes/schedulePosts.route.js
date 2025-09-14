// dependencies
import express from 'express';
const router = express.Router();
import { verifyAuth } from '../middlewares/auth.middleware.js';

// controller logic
import { schedulePosts } from '../controllers/schedulePosts.controller.js';

// route paths
router.post('/', verifyAuth, schedulePosts);

export default router;