import mongoose, { mongo } from 'mongoose'

const postSchema = new mongoose.Schema({
    codeSnippet: {
        type: String,
        required: true
    },
    caption: {
        type: String,
        required: true
    },
    hashtags: {
        type: String,
        required: true
    },
    correctAns: {
        type: String,
        required: true
    },
    explaination: {
        type: String,
        required: true
    },
    langauge: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "not_scheduled",
        enum: ["not_scheduled", "scheduled", "posted", "failed"]
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    batch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Batch"
    },
    scheduledAt: {
        type: Date
    },

    // cloudinary public ids
    bgColor: Object,
    codeColor: Object,
    jobId: String,
    tweetMediaId: String,
    tweetId: String,
    replyMediaId: String,
    replyTweet: String
}, { timestamps: true })

const Post = mongoose.model("Post", postSchema)

export default Post;