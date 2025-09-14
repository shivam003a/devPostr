import { z } from 'zod'

export const loginSchema = z.object({
    email: z
        .string()
        .email({ message: "Must be a valid email address" }),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long" })
        .max(100, { message: "Password must be less than 100 characters" }),
})

export const registerSchema = z.object({
    name: z
        .string()
        .min(3, { message: "Name must be at least 3 characters long" })
        .max(40, { message: "Name must be less than 40 characters" }),
    email: z
        .string()
        .email({ message: "Must be a valid email address" }),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long" })
        .max(100, { message: "Password must be less than 100 characters" }),
})

export const otpSchema = z.object({
    otpCode: z
        .string()
        .length(6, { messege: "OTP must be exactly 6 digits" })
        .regex(/^\d+$/, { messahe: "OTP must contain only numbers" })
})

export const generatePostsSchema = z.object({
    prompt: z
        .string()
        .min(10, { message: "Prompt must be at least 10 characters long" })
        .max(150, { message: "Prompt must be less than 150 characters" }),
    langauge: z
        .string()
        .min(1, { message: "Language must be at least 10 characters long" })
        .max(20, { message: "Language must be less than 20 characters" }),
    noOfPosts: z.coerce
        .number()
        .min(1, { messege: "noOfPosts must be at least 1" })
        .max(10, { message: "noOfPosts cannot exceed 10" }),
})
