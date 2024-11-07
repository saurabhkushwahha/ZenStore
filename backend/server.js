import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import {connectDB} from './lib/db.js'
import path from 'path'

import authRoutes from './routes/auth.route.js'
import productRoutes from './routes/product.route.js'
import cartRoutes from './routes/cart.route.js'
import paymentRoutes from './routes/payment.route.js'
import analyticsRoutes from './routes/analytics.route.js'
import couponRoutes from './routes/coupon.route.js'

dotenv.config()

const app= express()

const PORT = process.env.PORT || 5000;
const __dirname=path.resolve()

app.use(express.json({limit:"10mb"}))
app.use(cookieParser())

// Middleware
app.use(cors({
   origin:'http://localhost:5173',
   credentials:true
}))

// Routes
app.use('/api/auth',authRoutes)
app.use('/api/products',productRoutes)
app.use('/api/cart',cartRoutes)
app.use('/api/coupon',couponRoutes)
app.use('/api/payment',paymentRoutes)
app.use('/api/analytics', analyticsRoutes)



if(process.env.NODE_ENV==="production"){
 app.use(express.static(path.join(__dirname,"/frontend/dist")))
 app.get('*',(req,res)=>{
    res.sendFile(path.resolve(__dirname,"frontend","dist","index.html"));
 });
}




app.listen(PORT,async()=>{
  try {
    await connectDB()
   console.log(`Server UP & Running : ${PORT}`)
  } catch (error) {
   console.error("Database connection error :",error)
   process.exit(1)
  }
})