import express from 'express';
const router = express.Router();
import { verifyAuth } from '../middlewares/auth.middleware.js';

import { changeName, changePassword, deleteAccount } from '../controllers/settings.controller.js';

router.put('/change-details', verifyAuth, changeName);
router.put('/change-password', verifyAuth, changePassword);
router.delete('/delete-account', verifyAuth, deleteAccount);

export default router;