import { TwitterApi } from 'twitter-api-v2';
import client from '../lib/twitter.js'
import dotenv from 'dotenv'
import User from '../models/user.models.js';
import { encryptData } from '../lib/crypto.js'

dotenv.config();

const tempTokens = {}

export const requestToken = async (req, res) => {
    try {
        const { oauth_token, oauth_token_secret, url } =
            await client.generateAuthLink(process.env.X_CALLBACK_URL)

        tempTokens[oauth_token] = oauth_token_secret;
        return res.success("Auth Link Generated", { url }, 200)

    } catch (e) {
        console.error("Error generating auth link:", e)
        return res.error("Error connecting to Twitter", null, 500)
    }
}

export const twitterCallabck = async (req, res) => {
    try {
        const { _id, email } = req.user
        const { oauth_token, oauth_verifier } = req.query;
        const oauth_token_secret = tempTokens[oauth_token];

        if (!oauth_token_secret) {
            return res.error("Invalid or expired token", null, 400)
        }

        const tempClient = new TwitterApi({
            appKey: process.env.X_API_KEY,
            appSecret: process.env.X_API_KEY_SECRET,
            accessToken: oauth_token,
            accessSecret: oauth_token_secret

        })

        const { client: loggedClient, accessToken, accessSecret } =
            await tempClient.login(oauth_verifier)

        // Encypt accessSecret/accessToken
        const encryptedAccessToken = encryptData(accessToken)
        const encryptedAccessSecret = encryptData(accessSecret)
        const user = await User.findOneAndUpdate(
            { email, _id },
            { twitterAccessSecret: encryptedAccessSecret, twitterAccessToken: encryptedAccessToken, isTwitterConnected: true },
            { new: true }
        )

        return res.redirect(`${process.env.FE_URL}/dashboard?twitter=connected`);

    } catch (e) {
        console.error("Callback error:", e);
        res.error("Twitter login failed", null, 500);
    }
}

export const disconnectTwitter = async (req, res) => {
    try {
        const { _id } = req.user;
        const user = await User.findById(_id);

        if (!user) {
            return res.error("User Not Found", null, 404)
        }
        user.twitterAccessSecret = null;
        user.twitterAccessToken = null;
        user.isTwitterConnected = false;
        await user.save();

        return res.success("Twitter Disconnected!", null, 200);
    } catch (e) {
        console.error("Callback error:", e);
        res.error("Disconnecting Twitter failed", null, 500);
    }
}