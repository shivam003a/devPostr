// dependencies
import express from 'express';
const router = express.Router();
import { verifyAuth } from '../middlewares/auth.middleware.js';

// controller
import { login, register, logout, checkAuth, verifyOtp } from '../controllers/auth.controller.js';

// path
router.post('/login', login);
router.post('/register', register);
router.post('/verify-otp', verifyOtp);
router.post('/logout', logout);
router.get('/check-auth', verifyAuth, checkAuth);

export default router;
