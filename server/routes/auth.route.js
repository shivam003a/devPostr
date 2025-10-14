// dependencies
import express from 'express';
const router = express.Router();
import { verifyAuth } from '../middlewares/auth.middleware.js';

// controller
import { login, register, logout, checkAuth, verifyOtp, forgotPassword, resetPassword } from '../controllers/auth.controller.js';

// path
router.post('/login', login);
router.post('/register', register);
router.post('/verify-otp', verifyOtp);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)
router.get('/check-auth', verifyAuth, checkAuth);

export default router;
