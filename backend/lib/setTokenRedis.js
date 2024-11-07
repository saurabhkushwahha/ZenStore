import {redis} from './redis.js'

export const setTokenRedis=async(refreshToken,userId)=>{
    await redis.set(`refreshToken:${userId}`,refreshToken,"EX",7*24*60*60)  //7days
}