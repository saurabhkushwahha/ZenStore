import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import { createCheckOutSession,checkOutSuccess } from "../controllers/payment.controller.js";
const router = express.Router()

router.post('/create-checkout-session',protectedRoute,createCheckOutSession)

router.post('/checkout-success',protectedRoute, checkOutSuccess)


export default router;