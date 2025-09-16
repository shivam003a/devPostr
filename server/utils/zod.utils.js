import { z } from 'zod'

export const registerSchema = z.object({
    name: z
        .string({
            required_error: "name field is required",
            invalid_type_error: "Not a string"
        })
        .min(2, { message: "Name must be at least 2 characters long" })
        .max(100, { message: "Name must not exceed 50 characters" }),
    email: z
        .string()
        .email({ message: "Please provide a valid email address" }),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long" })
        .max(100, { message: "Password must not exceed 100 characters" })
})

export const loginSchema = z.object({
    email: z
        .string()
        .email({ message: "Please provide a valid email address" }),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long" })
        .max(100, { message: "Password must not exceed 100 characters" })
})

export const verifyOtpSchema = z.object({
    _id: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, "_id must be a 24-char hex ObjectId"),
    email: z
        .string()
        .email({ message: "Please provide a valid email address" }),
    otpCode: z
        .string()
        .regex(/^\d{6}$/, "otpCode must be a 6-digit code")
})

export const genContentByPromptSchema = z.object({
    langauge: z
        .string()
        .min(1, { message: "Language must be at least 1 characters long" }),
    prompt: z
        .string()
        .min(1, { message: "Prompt is required" }),
    noOfPosts: z.coerce
        .number()
        .int("noOfPosts must be an integer")
        .min(1, { messege: "noOfPosts must be at least 1" })
        .max(10, { message: "noOfPosts cannot exceed 10" }),
})

export const schedulePostSchema = z.object({
    postId: z
        .string()
        .nonempty({ message: "postId is required" }),
    batchId: z
        .string()
        .nonempty({ message: "batchId is required" }),
    scheduledAt: z
        .string()
        .refine((val) => !val || !isNaN(Date.parse(val)), {
            message: "scheduledAt must be a valid date",
        }),
});