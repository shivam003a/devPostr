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
    console.log(`[Job ${job.id}] Processing: postId=${postId}, batchId=${batchId}, userId=${userId}`);

    try {
        // Check for User
        const user = await User.findById(userId)
        if (!user) {
            console.error("User Not Found for job:", job?.id)
            throw new Error(`[Job ${job.id}] User not found: postId=${postId}, batchId=${batchId}, userId=${userId}`);
        }
        if (!user?.twitterAccessSecret || !user?.twitterAccessToken || !user?.isTwitterConnected) {
            console.error("Twitter not connected for job:", job?.id)
            throw new Error(`[Job ${job.id}] Twitter not connected: postId=${postId}, batchId=${batchId}, userId=${userId}`);
        }
        const userClient = new TwitterApi({
            appKey: process?.env?.X_API_KEY,
            appSecret: process?.env?.X_API_KEY_SECRET,
            accessToken: user?.twitterAccessToken,
            accessSecret: user?.twitterAccessSecret,
        });
        await userClient.v1.verifyCredentials();

        // Check for Post
        const post = await Post.findOne({
            _id: postId,
            batch: batchId,
            createdBy: userId
        })
        if (!post) {
            console.error("Post Not Found for job:", job?.id)
            throw new Error(`[Job ${job.id}] Post not found: postId=${postId}, batchId=${batchId}, userId=${userId}`);
        }

        const { caption, hashtags } = post;

        const tags = hashtags ? hashtags.split(',').map((tag) => `#${tag.trim()}`).join(" ") : ""
        const codeCaption = caption + "\n\n" + tags;
        const explainationCaption = "Here is the explaination for above code\n"

        // Get Images, Cloudinary Links
        const [codeData, explainationData] = await Promise.allSettled([
            processPost("code", post),
            processPost("explaination", post)
        ])

        // Tweet Values
        let codeMediaId = null;
        let codeTweet = null;
        let explainationMediaId = null;
        let explainationTweet = null;

        // Initiate Tweets
        if (codeData?.status === 'fulfilled') {
            codeMediaId = await userClient.v1.uploadMedia(codeData?.value?.buffer, { mimeType: EUploadMimeType.Png })
            codeTweet = await userClient?.v2.tweet({
                text: codeCaption,
                media: codeMediaId ? { media_ids: [codeMediaId] } : undefined
            })
            post.tweetId = codeTweet?.data?.id;
            post.status = "posted"
            await post.save();
        }

        // make a thread
        if (explainationData?.status === 'fulfilled') {
            explainationMediaId = await userClient.v1.uploadMedia(explainationData?.value?.buffer, { mimeType: EUploadMimeType.Png })

            explainationTweet = await userClient?.v2.tweet({
                text: explainationCaption,
                media: explainationMediaId ? { media_ids: [explainationMediaId] } : undefined,
                reply: { in_reply_to_tweet_id: codeTweet?.data?.id }
            })
            post.replyTweet = explainationTweet?.data?.id;
            await post.save();
        }

        if (codeData.status === 'rejected' && explainationData.status === 'rejected') {
            throw new Error('Uploading Tweets Failed')
        }

        jobCount++;
        await restartBrowser();
        return `Tweeted Sucessfully with tweetId: ${codeTweet?.data?.id}, postId: ${postId}`

    } catch (e) {
        try { await Post.findByIdAndUpdate(postId, { status: 'failed' }, { new: true }) }
        catch (err) { throw err; }

        console.error(`[Job ${job.id}] Failed 2: postId=${postId}, batchId=${batchId}, userId=${userId} - Error: ${e.message}`);
        throw e;
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
        try {
            if (page) await page.close()
        } catch (err) { console.error("Error closing browser:", err) }
    }
}

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