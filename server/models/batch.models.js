import mongoose from "mongoose";

const batchSchema = new mongoose.Schema({
    langauge: {
        type: String,
        required: true
    },
    prompt: {
        type: String,
        required: true
    },
    noOfPosts: {
        type: Number,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true });

const Batch = mongoose.model("Batch", batchSchema);
export default Batch;
