import { Queue } from 'bullmq'
import { connection } from './redis.js'

const twitterQueue = new Queue('twitter_posts', {
    connection
})

export default twitterQueue;