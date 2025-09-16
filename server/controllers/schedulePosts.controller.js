import twitterQueue from "../lib/queue.js";
import Post from "../models/post.models.js";
import User from '../models/user.models.js'

export const schedulePosts = async (req, res) => {
    try {
        const { _id: userId } = req.user;
        const { posts: postToSchedule } = req.body;

        if (!Array.isArray(postToSchedule) || postToSchedule?.length <= 0) {
            return res.error("Payload must be non-empty array", null, 400)
        }
        if (postToSchedule?.length > 10) {
            return res.error("Payload array length must be < 10", null, 400)
        }

        // Check for Twiiter Auth
        const user = await User.findById(userId);
        if (!user) {
            return res.error("User not found", null, 404)
        }
        if (!user.twitterAccessSecret || !user.twitterAccessToken || !user.isTwitterConnected) {
            return res.error("Connect Twitter to post", null, 400)
        }

        // Get Valid posts
        const validPosts = postToSchedule?.filter(post => (
            post?.selected && post?.scheduledAt && post?.status === 'not_scheduled'
        ))

        if (validPosts?.length === 0) {
            return res.error("No Valid Post to Schedule", null, 400)
        }

        const schedulePromises = validPosts?.map(async (post) => {
            const { bgColor, codeColor, _id: postId, batch: batchId, scheduledAt } = post;

            const updatedPost = await Post.findOne({
                _id: postId,
                createdBy: userId,
                batch: batchId,
                status: "not_scheduled"
            })
            if (!updatedPost) {
                throw new Error(`Post not found or already scheduled: ${postId}`)
            }

            if (!post?.scheduledAt?.endsWith('Z')) {
                throw new Error(`Invalid scheduledAt format, must be UTC ISO string: ${post._id}`)
            }
            const delay = new Date(scheduledAt).getTime() - Date.now()

            // if found, add to bullMQ
            const job = await twitterQueue.add('twitter_code_snnippet', { postId, batchId, userId }, {
                jobId: postId,
                delay: delay > 0 ? delay : 0,
                removeOnComplete: { age: 3600, count: 100 },
                removeOnFail: { age: 7 * 24 * 3600, count: 50 },
                attempts: 3,
                backoff: { type: 'exponential', delay: 2000 }
            })

            // update mongodb post, update bgColor, codeColor, status to "scheduled", also store job id to deletelater frombullmq
            updatedPost.codeColor = codeColor;
            updatedPost.bgColor = bgColor;
            updatedPost.status = "scheduled";
            updatedPost.scheduledAt = scheduledAt
            updatedPost.jobId = job?.id;

            await updatedPost.save();
            return `Post ${postId} scheduled successfully`;
        })

        const response = await Promise.allSettled(schedulePromises)

        const success = response
            .filter(res => res.status === "fulfilled")
            .map(res => res.value)

        const failed = response
            .filter(res => res.status === "rejected")
            .map(res => res.reason.message)

        return res.success('Post Scheduling Completed', { success, failed }, 200)

    } catch (e) {
        console.error("Error Scheduling Posts", e)
        return res.error("Scheduling Posts Failed", null, 500)
    }
}