import productModel from '../model/productModel.js'

// addtoCart
export const addToCart= async (req,res)=>{
   try {
    const {productId}= req.body
    const user= req.user
    const existingItem=user.cartItems.find((item)=>item._id==productId)
    // exitingItem take the refrence of the  usercartItems with productId
    if(existingItem){
      existingItem.quantity+=1;
    }
    else{
       user.cartItems.push(productId)
    }

    await user.save()
    res.status(200).json(user.cartItems)

   } catch (error) {
     console.error("Error in ADD to CartContoller :",error.message);
      res.status(500).json({message:"Server Error",error:error.message})
   }
}

// removeallQuantity

export const removeAllFromCart=async (req,res)=>{
     try {
      const {id:productId}=req.body;
      console.log(req.body,"dekho")
      console.log(productId,'bakcend endpoint chedking')
      const  user=req.user
       if(!productId){
          user.cartItems=[]
       }
       else{
           user.cartItems=user.cartItems.filter((item)=>item.id!==productId)
       }
       await user.save()
       res.status(200).json(user.cartItems)

     } catch (error) {
      console.error("Error in RemoveAllFromCart Error :",error.message)
       res.status(500).json({message:"Server error",error:error.message})
     }
}


// update the quantity
export const  updateQuantity= async (req,res)=>{
      try {
         const {id:productId}=req.params
         const {ChangeQuantity:quantity}=req.body
         const  user=req.user
         const existingItem=user.cartItems.find((item)=>item.id==productId)

        //  Since existingItem is a reference to the actual object in user.cartItems,
        // modifying existingItem.quantity is the same as modifying user.cartItems[idx].quantity.

         if(existingItem){
            if(quantity===0)
            {
              user.cartItems=user.cartItems.filter((item)=>item.id!==productId)
              await user.save()
              return res.status(200).json(user.cartItems)
            }

            existingItem.quantity=quantity
            // const idx =user.cartItems.findIndex((item)=>item.id===productId)
            //  user.cartItems[idx].quantity=quantity
            await user.save()
            res.status(200).json(user.cartItems)

         }else{
           res.status(404).json({message:"Proudct Not found !"})
         }

      } catch (error) {
       console.error("Error in updateQuantity :",error.message)
       res.status(500).json({message:"Server error",error:error.message})
      }
}


// getallProducts
export const getAllProducts= async (req,res)=>{
 try {
    const user=req.user
    const products= await productModel.find({_id:{$in:user.cartItems}}) // get all the products whose products whose Id is eql to user.cartItems Id

    const cartItem= products.map((product)=>{
            const item= user.cartItems.find((cartItem)=>cartItem.id==product.id)
         return {...product.toJSON(), quantity:item.quantity}   // ..product.toJSON change the  mongoose object and any other object to plain javascirpt object
    })
   res.status(200).json(cartItem)

 } catch (error) {
    console.error("Error in GETAllProduct :",error.message)
    res.status(500).json({message:"Server Error",error:error.message})
 }
}