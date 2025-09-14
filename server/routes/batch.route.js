// dependencies
import express from 'express';
const router = express.Router();
import { verifyAuth } from '../middlewares/auth.middleware.js';

// controller logic
import { getBatches, getAllPostsByBatchId, deleteBatch } from '../controllers/batch.controller.js';

// route paths
router.get('/', verifyAuth, getBatches);
router.get('/:batchId', verifyAuth, getAllPostsByBatchId);
router.delete('/:batchId', verifyAuth, deleteBatch)

export default router;
