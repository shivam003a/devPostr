import mongoose from "mongoose";
import User from "../models/user.models.js";
import { cookieOptions } from "../utils/cookieOptions.js";
import { comparePassword, hashPassword } from "../utils/password.utils.js";
import { changeNameSchema, changePasswordSchema, deleteAccountSchema } from "../utils/zod.utils.js";
import Post from "../models/post.models.js";
import Batch from "../models/batch.models.js";

export const changeName = async (req, res) => {
    const { _id: userId } = req.user;

    try {
        const parsed = changeNameSchema.safeParse(req.body)
        if (!parsed.success) {
            const errorsMsg = parsed?.error?.issues.map((err) => err?.message).join(', ')
            return res.error(errorsMsg, null, 400)
        }

        const { name } = parsed?.data;

        const updatedUser = await User.findByIdAndUpdate(userId, {
            $set: { name }
        }, { new: true })

        if (!updatedUser) {
            return res.error("User Not Found", null, 404)
        }

        const userObj = updatedUser?.toObject();
        delete userObj.password;
        delete userObj.otpCode;
        delete userObj.otpCodeExpiresIn;
        delete userObj.twitterAccessSecret;
        delete userObj.twitterAccessToken;

        return res.success("Profile Update Successful", userObj, 200);

    } catch (e) {
        console.error("Error Changing Profile Details: ", e?.message)
        return res.error(e?.message || "Internal Server Error", null, 500)
    }
}

export const changePassword = async (req, res) => {
    const { _id: userId } = req.user

    try {
        const parsed = changePasswordSchema.safeParse(req.body)
        if (!parsed.success) {
            const errorMsg = parsed.error.issues.map((err) => err.message).join(', ');
            return res.error(errorMsg, null, 400)
        }

        const { newPassword, oldPassword } = parsed.data;

        const user = await User.findOne(
            { _id: userId, isVerified: true },
            { password: 1 }
        ).lean()
        if (!user) {
            return res.error("User not found", null, 404)
        }

        const isOldPasswordMatched = await comparePassword(oldPassword, user.password);
        if (!isOldPasswordMatched) {
            return res.error("TOAST:Incorrect old password", null, 401)
        }

        if (oldPassword?.trim() === newPassword?.trim()) {
            return res.error("Old password and new password can't be same", null, 400)
        }

        const hashedNewPassword = await hashPassword(newPassword);
        await User.updateOne({ _id: userId }, {
            $set: { password: hashedNewPassword }
        })

        const { httpOnly, secure, sameSite, path } = cookieOptions();
        res.clearCookie('token', {
            httpOnly,
            secure,
            sameSite,
            path,
        })

        return res.success("Password changed successfully", null, 200)

    } catch (e) {
        console.error("Error Changing Password: ", e?.message)
        return res.error(e?.message || "Internal Server Error", null, 500)
    }
}

export const deleteAccount = async (req, res) => {
    const { _id: userId } = req.user

    const session = await mongoose.startSession();
    console.log(req.body)
    try {
        const parsed = deleteAccountSchema.safeParse(req.body)
        if (!parsed.success) {
            const errorMsg = parsed.error.issues.map((err) => err.message).join(", ");
            return res.error(errorMsg, null, 400);
        }

        const { password } = parsed.data

        await session.withTransaction(async () => {
            const user = await User.findOne({ _id: userId, isVerified: true }, {
                password: 1
            }).session(session).lean()
            if (!user) {
                const err = new Error("TRANSACTION:User not found")
                err.statusCode = 400;
                throw err;
            }

            // Verify Password
            const isMatched = await comparePassword(password, user.password)
            if (!isMatched) {
                const err = new Error("TRANSACTION:Incorrect password");
                err.statusCode = 401;
                throw err;
            }

            await Promise.all([
                Post.deleteMany({ createdBy: userId }).session(session),
                Batch.deleteMany({ createdBy: userId }).session(session),
                User.deleteOne({ _id: userId }).session(session)
            ])
        })

        // clear cookie
        const { httpOnly, secure, sameSite, path } = cookieOptions();
        res.clearCookie('token', {
            httpOnly,
            secure,
            sameSite,
            path,
        })

        return res.success("Account deleted successfully", null, 200)

    } catch (err) {
        console.error("Transaction error:", err?.message);
        if (err?.message?.startsWith("TRANSACTION")) {
            const errorMsg = err?.message?.split(':')[1]
            return res.error(errorMsg, null, err.statusCode || 401);
        }
        return res.error(e?.message || "Internal Server Error", null, 500)
    } finally {
        session.endSession();
    }
}