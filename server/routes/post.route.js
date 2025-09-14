// dependencies
import express from 'express';
const router = express.Router();
import { verifyAuth } from '../middlewares/auth.middleware.js';

// controller logic
import { getAllPostByUser, getPostById } from '../controllers/posts.controller.js';

// route paths
router.get('/', verifyAuth, getAllPostByUser);
router.get('/:postId', verifyAuth, getPostById);

export default router;