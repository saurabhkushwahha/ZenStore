import jwt from 'jsonwebtoken'
import userModel from '../model/userModel.js'



export const protectedRoute = async (req, res, next) => {
  try {

    const { accessToken } = req.cookies
    if (!accessToken) {
      return res.status(401).json({ message: "Unauthorized - No token is provided" })
    }

    try {

      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN)
      const user = await userModel.findById(decoded.userId).select("-password")

      if (!user) {
        return res.status(401).json({ message: "Unauthorized-Invalid token or User not found !" })
      }

      req.user = user
      next()

    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Unauthorized- Access Token is Expired" })
      }
      throw error;
    }

  } catch (error) {
    console.error("ProtectedRoute Error :", error.message)
    return res.status(401).json({ message: "Unauthorized-Invalid access token" })
  }

}



export const adminRoute = async (req, res, next) => {
  try {
    const user = req.user
    if (user && (user.role === "admin")) {
      next()
    }
    else {
      res.status(403).json({ message: "Unauthorized - ACCES Denied" })
    }

  } catch (error) {
    console.error("AdminRoute Error :", error.message)
  }
}