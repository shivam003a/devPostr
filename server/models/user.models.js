import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
        },
        otpCode: String,
        otpCodeExpiresIn: Date,
        isVerified: {
            type: Boolean,
            default: false,
        },
        twitterAccessSecret: String,
        twitterAccessToken: String,
        isTwitterConnected: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
