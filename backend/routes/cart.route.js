import express from 'express'
import { protectedRoute } from '../middleware/auth.middleware.js'
import {getAllProducts,addToCart,removeAllFromCart,updateQuantity} from '../controllers/cart.controller.js'
const router= express.Router()

router.get('/',protectedRoute,getAllProducts)
router.post('/',protectedRoute,addToCart)
router.delete('/',protectedRoute,removeAllFromCart)
router.put('/:id',protectedRoute,updateQuantity)


export default router