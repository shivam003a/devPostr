import { Worker } from 'bullmq'
import { connection } from '../lib/redis.js'
import { connectDB } from '../config/connect.db.js';
import dotenv from 'dotenv'
import User from '../models/user.models.js'
import Post from '../models/post.models.js'
import puppeteer from 'puppeteer'
import { codeImageTemplate, explainationImageTemplate } from '../templates/codeImageTemplates.js';
import { EUploadMimeType, TwitterApi } from 'twitter-api-v2';
import js_beautify from 'js-beautify'
import pkg from 'he'
import { decryptData } from '../lib/crypto.js';
const { encode } = pkg

// Puppeteer Optimization Variables
let jobCount = 0;
const MAX_JOBS = 30;
const MAX_AGE_MS = 30 * 60 * 1000;
let browserStartTime = Date.now()


dotenv.config();

// Connect to MongoDB first
await connectDB();
console.log("Starting Worker for twitter_posts Queue...")
let browser = null;
let browserClosed = true;

const worker = new Worker('twitter_posts', async (job) => {

    const { postId, batchId, userId } = job?.data;
    let post = null;
    console.log(`[Job ${job.id}] Processing: postId=${postId}, batchId=${batchId}, userId=${userId}`);

    try {
        const twitterClient = await validateUser(userId, postId, batchId, job);
        post = await validatePost(userId, postId, batchId, job);

        // Process Captions
        const { caption, hashtags } = post;
        const { codeCaption, explainationCaption } = processCaptions(hashtags, caption);

        // Generate Image
        const [codeData, explainationData] = await Promise.allSettled([
            processPost("code", post),
            processPost("explaination", post)
        ])

        // Make Code Tweet
        if (codeData?.status === 'fulfilled') {
            if (!post?.tweetMediaId) {
                const mediaId = await twitterClient.v1.uploadMedia(codeData?.value?.buffer, {
                    mimeType: EUploadMimeType.Png
                })
                post.tweetMediaId = mediaId;
                await post.save();
            }

            const codeMediaId = post?.tweetMediaId;

            if (!post?.tweetId) {
                if (!codeMediaId) {
                    throw new Error("Cannot post code tweet: missing code media ID");
                }
                const codeTweet = await twitterClient?.v2.tweet({
                    text: codeCaption,
                    media: codeMediaId ? { media_ids: [codeMediaId] } : undefined
                })
                post.tweetId = codeTweet?.data?.id;
                post.status = "posted"
                await post.save();
            }
        }

        // make a thread
        if (explainationData?.status === 'fulfilled') {
            if (!post?.replyMediaId) {
                const mediaId = await twitterClient.v1.uploadMedia(explainationData?.value?.buffer, { mimeType: EUploadMimeType.Png })
                post.replyMediaId = mediaId;
                await post.save();
            }

            const explainationMediaId = post.replyMediaId;
            const codeTweet = post?.tweetId;

            if (!post?.replyTweet) {
                // Ensure we have the tweet to reply to
                if (!codeTweet) {
                    throw new Error("Cannot post explanation reply: missing codeTweet ID");
                }

                // Ensure we have media (if your design requires it)
                if (!explainationMediaId) {
                    throw new Error("Cannot post explanation reply: missing explanation media ID");
                }
                const explainationTweet = await twitterClient?.v2.tweet({
                    text: explainationCaption,
                    media: explainationMediaId ? { media_ids: [explainationMediaId] } : undefined,
                    reply: { in_reply_to_tweet_id: codeTweet }
                })
                post.replyTweet = explainationTweet?.data?.id;
                await post.save();
            }
        }

        if (codeData.status === 'rejected' && explainationData.status === 'rejected') {
            throw new Error('Uploading Tweets Failed')
        }

        jobCount++;
        await restartBrowser();
        return `Tweeted Sucessfully:, postId: ${postId}`

    } catch (e) {
        if (!post?.tweetId) {
            try {
                await Post.findByIdAndUpdate(postId, { status: 'failed' }, { new: true })
            } catch (error) {
                throw e;
            }
            throw e;
        }

        console.warn(`Code tweeted successfully, explanation failed: ${e.message}`);
        return `Code tweet posted successfully`;
    }

}, { connection, concurrency: 1, lockDuration: 5 * 60 * 1000 })

// Worker Event Listeners
worker.on('active', (job) => {
    console.log(`[Job ${job.id}] Started: postId=${job.data.postId}, batchId=${job.data.batchId}, userId=${job.data.userId}`)
})
worker.on('completed', (job) => {
    console.log(`[Job ${job.id}] Completed successfully: postId=${job.data.postId}, batchId=${job.data.batchId}, userId=${job.data.userId}`)
})
worker.on('failed', (job, err) => {
    console.error(`[Job ${job.id}] Failed 3: postId=${job.data.postId}, batchId=${job.data.batchId}, userId=${job.data.userId} - Error: ${err}`)
})
worker.on('error', (err) => console.error(`Worker Error:`, err))


// GraceFul Shutdown
const shutdown = async () => {
    console.log("Shutting down Worker...")
    await worker.close();
    if (browser) {
        for (const page of await browser.pages()) await page.close();
        await browser.close();
    }
    process.exit(1)
}
process.on("SIGINT", shutdown)
process.on("SIGTERM", shutdown)

const initBrowser = async () => {
    if (!browser || browserClosed) {
        browser = await puppeteer.launch({
            headless: true,
            executablePath: puppeteer.executablePath(),
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
            ]
        })
        browserClosed = false;
        browser.on('disconnected', () => { browserClosed = true })
        console.log("Puppeteer Browser Launched")
    }
    return browser;
}

const restartBrowser = async () => {
    const age = Date.now() - browserStartTime;
    if (jobCount >= MAX_JOBS || age >= MAX_AGE_MS) {
        console.log("Restarting Puppeteer Browser...")
        try {
            if (browser && !browserClosed) await browser.close();
        } catch (e) {
            console.error("Error closing browser:", e);
        }
        browser = null;
        jobCount = 0;
        browserStartTime = Date.now();
    }
}

const validateUser = async (userId, postId, batchId, job) => {
    try {
        const user = await User.findById(userId)
        if (!user) {
            console.error("User not found for jobId:", job?.id)
            throw new Error(`[Job ${job.id}] User not found: postId=${postId}, batchId=${batchId}, userId=${userId}`);
        }
        if (!user?.twitterAccessSecret || !user?.twitterAccessToken || !user?.isTwitterConnected) {
            console.error("Twitter not connected for userId:", userId)
            throw new Error(`[Job ${job.id}] Twitter not connected: postId=${postId}, batchId=${batchId}, userId=${userId}`);
        }

        const twitterClient = new TwitterApi({
            appKey: process?.env?.X_API_KEY,
            appSecret: process?.env?.X_API_KEY_SECRET,
            accessToken: decryptData(user?.twitterAccessToken),
            accessSecret: decryptData(user?.twitterAccessSecret),
        });
        try {
            await twitterClient.v1.verifyCredentials();
        } catch (error) {
            await User.findByIdAndUpdate(userId, {
                $set: {
                    twitterAccessSecret: null,
                    twitterAccessToken: null,
                    isTwitterConnected: false
                }
            })
            throw new Error("Invalid Twitter credentials for userId:", userId)
        }

        return twitterClient;

    } catch (err) {
        throw err;
    }
}

const validatePost = async (userId, postId, batchId, job) => {
    try {
        const post = await Post.findOne({
            _id: postId,
            batch: batchId,
            createdBy: userId
        })
        if (!post) {
            console.error("Post Not Found for job:", job?.id)
            throw new Error(`[Job ${job.id}] Post not found: postId=${postId}, batchId=${batchId}, userId=${userId}`);
        }
        return post;

    } catch (err) {
        throw err;
    }
}

const processCaptions = (hashtags, caption) => {
    const tags = hashtags ? hashtags.split(',').map((tag) => `#${tag.trim()}`).join(" ") : ""
    const codeCaption = caption + "\n\n" + tags;
    const explainationCaption = "Here is the explaination for above code\n"

    return { codeCaption, explainationCaption };
}

const processPost = async (type, post) => {
    let htmlTemplate;
    let page;

    if (type === "code") {
        const formattedCode = js_beautify(post?.codeSnippet?.trim(), {
            indent_size: 2,
            space_in_empty_paren: true,
            break_chained_methods: true,
            preserve_newlines: true,
            max_preserve_newlines: 2,
            wrap_line_length: 80,
        })
        const escapedCodeSnippet = encode(formattedCode, {
            useNamedReferences: true
        })
        htmlTemplate = codeImageTemplate(post?.langauge, post?.bgColor, post?.codeColor, escapedCodeSnippet);
    }
    else {
        htmlTemplate = explainationImageTemplate(post?.langauge, post?.bgColor, post?.codeColor, post?.correctAns, post?.explaination)
    }

    try {
        const browser = await initBrowser()
        page = await browser.newPage();
        await page.setViewport({ width: 600, height: 600, deviceScaleFactor: 2 });
        await page.setContent(htmlTemplate, { waitUntil: 'networkidle0' });
        await new Promise(resolve => setTimeout(resolve, 100))
        const buffer = await page.screenshot({ type: 'png' })

        return {
            buffer: buffer
        }
    } catch (e) {
        console.error("Something Went Wrong:", e)
        throw e;
    } finally {
        try { if (page) await page.close() }
        catch (err) { console.error("Error closing browser:", err) }
    }
}