import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export const generateToken= (userId)=>{
      const accessToken= jwt.sign({userId},process.env.ACCESS_TOKEN,{
        expiresIn:"15m"
      })
      const refreshToken=jwt.sign({userId},process.env.REFRESH_TOKEN,{
         expiresIn:"7d"
      })
      return {accessToken,refreshToken}
}