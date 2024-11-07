import express from 'express'
import {protectedRoute,adminRoute} from '../middleware/auth.middleware.js'
import  {getAllProducts,getFeaturedProducts,toggleFeaturedProducts,getRecommendedProducts,createProducts,deleteProducts,getProductByCategory} from '../controllers/product.controller.js'

 const router=express.Router()

 router.get("/featured", getFeaturedProducts) // all

 router.get("/recommendations",getRecommendedProducts) // all



 router.get("/category/:category",getProductByCategory) //all


 router.patch("/:id",protectedRoute,adminRoute, toggleFeaturedProducts) // only for admin
 router.get("/" ,protectedRoute,adminRoute,getAllProducts) // only for admin
 router.post("/",protectedRoute,adminRoute,createProducts) // only for admin
 router.delete("/:id",protectedRoute,adminRoute,deleteProducts) // only for admin











 export default router;