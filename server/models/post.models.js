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
    codeUrl: String,
    explainationUrl: String,
    scheduledAt: {
        type: Date
    },

    // cloudinary public ids
    codePublicId: String,
    explainationPublicId: String,
    bgColor: Object,
    codeColor: Object,
    jobId: String,
    tweetId: String,
    replyTweet: String
}, { timestamps: true })

const Post = mongoose.model("Post", postSchema)

export default Post;