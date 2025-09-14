// importing dependencies
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { responseMiddleware } from './middlewares/response.middleware.js';
import morgan from 'morgan';
import { connectDB } from './config/connect.db.js';
import authRoutes from './routes/auth.route.js';
import contentRoute from './routes/content.route.js';
import batchRoute from './routes/batch.route.js'
import postRoute from './routes/post.route.js'
import schedulePostsRoute from './routes/schedulePosts.route.js'
import twitterRoutes from './routes/twitter.route.js'
import expressMongoSanitize from '@exortek/express-mongo-sanitize'

// initialiazing
const app = express();
dotenv.config();

// constants
const PORT = process.env.PORT || 5000;

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: process.env.FE_URL,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
    })
);
app.use(cookieParser());
app.use(responseMiddleware);
app.use(morgan('dev'));
app.use(expressMongoSanitize({
    skipRoutes: ['/api/schedule']
}))

// routes, for pinging like cron jobs
app.get('/', async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Fetched Root Path',
        data: null,
    });
});

// routes
app.use('/api/auth', authRoutes);
app.use('/api/generate', contentRoute);
app.use('/api/batch', batchRoute);
app.use('/api/posts', postRoute);
app.use('/api/schedule', schedulePostsRoute)
app.use('/api/twitter', twitterRoutes)

// listen
app.listen(PORT, async function () {
    console.log(`Server is running at PORT: ${PORT}`);
    await connectDB();
});
