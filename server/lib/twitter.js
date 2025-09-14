import { TwitterApi } from "twitter-api-v2";
import dotenv from 'dotenv'

dotenv.config()

const client = new TwitterApi({
    appKey: process.env.X_API_KEY,
    appSecret: process.env.X_API_KEY_SECRET
})

export default client;
