import IORedis from 'ioredis'
import dotenv from 'dotenv'

dotenv.config()

export const connection = new IORedis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    maxRetriesPerRequest: null
})

connection.on('connect', () => console.log("✅ Redis Connected"));
connection.on('ready', () => console.log("🚀 Redis Ready"));
connection.on('error', err => console.error("❌ Redis Error:", err));
connection.on('close', () => console.warn("⚠️ Redis Connection Closed"));
connection.on('reconnecting', () => console.log("♻️ Reconnecting to Redis..."));