import express from 'express'
import { verifyAuth } from '../middlewares/auth.middleware.js'
const router = express.Router()

import { requestToken, twitterCallabck, disconnectTwitter } from '../controllers/twitter.controller.js';

router.get('/request_token', verifyAuth, requestToken)
router.get('/callback', verifyAuth, twitterCallabck)
router.post('/disconnect', verifyAuth, disconnectTwitter)

export default router;