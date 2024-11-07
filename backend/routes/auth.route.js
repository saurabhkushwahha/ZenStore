import express from 'express'
import {signup,login,logout,refreshToken, getProfile} from '../controllers/auth.controller.js'
import { protectedRoute } from '../middleware/auth.middleware.js';
const router= express.Router();


router.post("/signup",signup)
router.post("/login",login)
router.get("/logout",logout)

router.get('/refreshToken', refreshToken)
router.get('/getProfile',protectedRoute,getProfile)

export default router;