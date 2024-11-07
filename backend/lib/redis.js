import Redis from "ioredis"
import dotevn from 'dotenv'
dotevn.config()
export const redis = new Redis(process.env.UPSTASH_REDIS_URL);