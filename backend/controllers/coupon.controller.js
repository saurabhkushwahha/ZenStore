import couponModel from "../model/couponModel.js"

export const getCoupon = async (req,res)=>{
     try {
        const user=req.user
          const coupon=await couponModel.findOne({userId:user._id, isActive:true})
          res.json(coupon || null)
     } catch (error) {
       console.log("Error in GetCoupon ",error.message)
       res.status(500).json({message:"Server Error ",error:error.message})
     }
}


export const validateCoupon= async (req,res)=>{
    try {
        const code= req.body.code
        const user= req.user
        const coupon= await couponModel.findOne({userId:user._id,code:code,isActive:true})

        if(!coupon){
           res.status(400).json({message:"Not Any Coupon Found !"})
        }

        if(coupon.expirationDate < new Date()){
            coupon.isActive=false
            await coupon.save()
            res.status(400).json({message:"Coupon is Expired !"})
        }


        res.status(200).json({
          message: "Coupon is valid",
           code: coupon.code,
          discountPercentage:coupon.discountPercentage,

        })

    } catch (error) {
     console.log("Error in Validating the Coupon :",error.message)
     res.status(500).json({message:"Server Error",error:error.message})
    }
}