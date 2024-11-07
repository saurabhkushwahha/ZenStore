import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

export const connectDB=async()=>{
    try {
    const conn= await mongoose.connect(process.env.MONGO_URL)
    console.log(`MONGO DB connected ${conn.connection.host}`)
    } catch (error) {
      console.log("SERVER Connection ERRor!",error)
      process.exit(1) // 1 is for failure and 0 is for success
    }

}
