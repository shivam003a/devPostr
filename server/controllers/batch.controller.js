import mongoose from "mongoose";
import Batch from "../models/batch.models.js";
import Post from "../models/post.models.js";

export const getBatches = async (req, res) => {
    try {
        const { _id } = req.user;

        // get all batches
        const batches = await Batch
            .find({ createdBy: _id })
            .sort({ createdAt: -1 })
            .lean();

        // send response
        return res.success("Batches Fetched", batches, 200)

    } catch (e) {
        console.error(e?.message);
        return res.error('Internal Server Error', null, 500);
    }
}

export const getAllPostsByBatchId = async (req, res) => {
    try {
        const { _id } = req.user;
        const { batchId } = req.params;
        let { page = 1, limit = 10 } = req.query;

        page = Number(page) || 1;
        limit = Math.min(Number(limit) || 10, 20)

        // total post by batchId
        const totalPostsByBatchId = await Post.countDocuments({ createdBy: _id, batch: batchId })

        // get all batches
        const allPostsByBatchId = await Post
            .find({ createdBy: _id, batch: batchId })
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 })
            .lean();

        // send response
        return res.success(
            "Post By BatchId Fetched",
            {
                body: allPostsByBatchId,
                pagination: {
                    totalDocuments: totalPostsByBatchId,
                    totalPages: Math.ceil(totalPostsByBatchId / limit),
                    currentPage: page,
                    pageSize: limit
                }
            },
            200)

    } catch (e) {
        console.error(e?.message);
        return res.error('Internal Server Error', null, 500);
    }
}

export const deleteBatch = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        const { _id: userId } = req.user;
        const { batchId } = req.params;

        if (!batchId) {
            return res.error("batchId required", null, 400)
        }

        let deletedBatch = null;
        await session.withTransaction(async () => {
            // check if batch exists
            const batch = await Batch.findOne({ _id: batchId, createdBy: userId }).session(session)

            if (!batch) {
                throw new Error("NO_BATCH_FOUND")
            }

            // delete post related to this batch
            await Post.deleteMany({ batch: batchId, createdBy: userId }).session(session)

            // delete batch
            deletedBatch = await Batch.findOneAndDelete({ _id: batchId, createdBy: userId }).session(session)
        })

        // success case
        if (!deletedBatch) {
            return res.error("No Batch found 1", null, 404);
        }

        // return response
        return res.success("Batch deleted", deletedBatch, 200)

    } catch (e) {
        if (e?.message === "NO_BATCH_FOUND") {
            return res.error("No Batch found 2", null, 404);
        }
        console.error(e?.message);
        return res.error('Internal Server Error', null, 500);
    } finally {
        session.endSession()
    }
}
