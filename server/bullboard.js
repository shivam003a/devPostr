// server.js
import express from 'express';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';  // ✅ correct for BullMQ
import { ExpressAdapter } from '@bull-board/express';
import twitterQueue from './lib/queue.js';

const app = express();
app.use(express.json());

// BullBoard setup
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

createBullBoard({
    queues: [new BullMQAdapter(twitterQueue)],
    serverAdapter,
});

app.use('/admin/queues', serverAdapter.getRouter());

// Add job route
app.post('/tweet', async (req, res) => {
    const { message } = req.body;
    await twitterQueue.add('sendTweet', { message });
    res.json({ status: 'added', message });
});

app.listen(3000, () => {
    console.log('🚀 Server running at http://localhost:3000');
    console.log('📊 Dashboard at http://localhost:3000/admin/queues');
});
