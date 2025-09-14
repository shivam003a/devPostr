import mongoose from "mongoose";
import { getAiResponseByPrompt } from "../lib/llm.lib.js";
import Batch from "../models/batch.models.js";
import Post from "../models/post.models.js";
import { getPromptFromText } from "../utils/prompt.utils.js";
import { genContentByPromptSchema } from "../utils/zod.utils.js";

export const getContentByPrompt = async (req, res) => {
	const session = await mongoose.startSession();

	try {
		const { _id } = req.user

		// validating req.body
		const parsed = genContentByPromptSchema.safeParse(req.body)
		if (!parsed.success) {
			const errorsMsg = parsed?.error?.issues?.map((err) => err?.message).join(", ")
			return res.error(errorsMsg, null, 400)
		}

		const { langauge, prompt, noOfPosts } = parsed?.data;
		if (!langauge || !prompt || !noOfPosts) {
			return res.error("All input fields are required", null, 400)
		}

		// get system and user prompt
		const { systemPrompt, userPrompt } = getPromptFromText(langauge, prompt, noOfPosts);

		// get llm response
		const response = await getAiResponseByPrompt(systemPrompt, userPrompt);
		if (!Array.isArray(response) || response.length === 0) {
			return res.error("Invalid AI response format", null, 500);
		}

		// start transaction
		session.startTransaction()

		// save it in batch collection
		const [newBatch] = await Batch.create([{
			langauge,
			prompt,
			noOfPosts,
			createdBy: _id
		}], { session })

		const modifiedResponse = response.map((res) => ({
			...res,
			langauge,
			status: "not_scheduled",
			createdBy: _id,
			batch: newBatch?._id,
			bgColor: { r: '168', g: '181', b: '192', a: '1' },
			codeColor: { r: '39', g: '40', b: '34', a: '1' }
		}))

		// save in post with draft: true
		const posts = await Post.insertMany(modifiedResponse, { session })

		// commit transaction
		await session.commitTransaction()

		// return response
		return res.success("Post Created", { batch: newBatch, posts }, 200)

	} catch (e) {
		if (session.inTransaction()) {
			await session.abortTransaction();
		}
		console.error(e?.message);
		return res.error('Internal Server Error', null, 500);
	} finally {
		session.endSession();
	}
};

