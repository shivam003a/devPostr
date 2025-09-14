import Post from "../models/post.models.js";

export const getAllPostByUser = async (req, res) => {
    try {
        const { _id } = req.user;
        let { page = 1, limit = 10 } = req.query;

        page = Number(page) || 1;
        limit = Math.min(Number(limit) || 10, 20);

        // get all post
        const totalPosts = await Post.countDocuments({ createdBy: _id });

        const allPosts = await Post
            .find({ createdBy: _id })
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 })
            .lean()

        return res.success(
            "Fetched All Post for a User",
            {
                body: allPosts,
                pagination: {
                    totalDocuments: totalPosts,
                    totalPages: Math.ceil(totalPosts / limit),
                    currentPage: page,
                    pageSize: limit
                }
            }
            , 200)


    } catch (e) {
        console.error("Error Fetching All Posts", e)
        return res.error("Fetching All Posts Failed", null, 500)
    }
}

export const getPostById = async (req, res) => {
    try {
        const { _id } = req.user;
        const { postId } = req.params;

        const post = await Post.findOne({
            _id: postId,
            createdBy: _id
        }).lean();

        // send resposne
        return res.success("Post Fetched", post, 200);

    } catch (e) {
        console.error("Error Fetching All Posts", e)
        return res.error("Fetching All Posts Failed", null, 500)
    }
}