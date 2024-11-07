import { generateToken } from "../lib/generateToken.js"
import { redis } from "../lib/redis.js"
import { setTokenCookie } from "../lib/setTokenCookie.js"
import { setTokenRedis } from "../lib/setTokenRedis.js"
import userModel from "../model/userModel.js"
import jwt, { decode } from 'jsonwebtoken'

// Signup
export const signup = async (req, res) => {
  try {
    const { email, password, name } = req.body
    const userAlreadyExits = await userModel.findOne({ email })
    if (userAlreadyExits) {
      return res.status(400).json({ message: "User Is Already Exits !" })
    }
    const user = await userModel.create({ email, password, name })

    // token generation
    const { accessToken, refreshToken } = generateToken(user._id)

    // set token in redis
    await setTokenRedis(refreshToken, user._id)

    // set token in cookie
    setTokenCookie(accessToken, refreshToken, res)


    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      password: user.password
    })

  } catch (error) {
    console.error("SignUp error :", error.message)
  }
}

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await userModel.findOne({email})
    if (user && (await user.comparePassword(password))) {
      // token generation
      const { accessToken, refreshToken } = generateToken(user._id)
      // set token in redis
      await setTokenRedis(refreshToken, user._id)
      // set token in cookie
      setTokenCookie(accessToken, refreshToken, res)
      res.status(200).json({
        message: "User Login successfully!", user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          password: user.password,
          role:user.role
        }
      })
    }
    else {
      res.status(400).json({ message: "Invalid email or password" })
    }
  } catch (error) {
    console.error("Login error :", error.message)
  }
}



export const logout = async (req, res) => {
  try {

    const  refreshToken  = req.cookies.refreshToken
    const decoded =  jwt.verify(refreshToken, process.env.REFRESH_TOKEN)

    // delete refreshToken from the redis
    await redis.del(`refreshToken:${decoded.userId}`)

    // clear cookie from refreshToken & accessToken
    res.clearCookie('refreshToken')
    res.clearCookie('accessToken')

    res.status(201).json({message:"LogOut successfully !"})

  } catch (error) {
    console.error("Logout Error :", error.message)
    res.status(400).json({message:"Logout Error"})
  }
}

export const  refreshToken=async (req,res)=>{
   try {
      const {refreshToken}=req.cookies

       if(!refreshToken){
          res.status(401).json({message:"Unauthorized-No refreshToken provided"})
       }

       const decoded=jwt.verify(refreshToken,process.env.REFRESH_TOKEN)
       const userId=decoded.userId
       const storeToken= await redis.get(`refreshToken:${userId}`)

       if(storeToken!==refreshToken)
       {
         re.status(400).json({message:"Unauthorized- No valid refreshtoken"})
       }

       const accessToken=  jwt.sign({userId},process.env.ACCESS_TOKEN,{
           expiresIn:'15m'
       })


       res.cookie("accessToken",accessToken,{
          httpOnly:true,
          secure:false,
          sameSite:'strict',
          maxAge: 15*60*1000
       })
     res.status(200).json({message:"Token refresh Successfully !"})

   } catch (error) {
     console.error("Refreshing .... :",error.message)
   }
}

export  const getProfile=async (req,res)=>{
    try {
      res.json(req.user)
    } catch (error) {
      console.error("Get Profile :",error.message)
    }
}