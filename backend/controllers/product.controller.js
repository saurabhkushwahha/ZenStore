import { redis } from '../lib/redis.js'
import productModel from '../model/productModel.js'
import cloudinary from '../lib/cloudinary.js'



// GET All Products
export const getAllProducts = async (req, res) => {
  try {
    const products = await productModel.find({}) // get all products
    res.status(200).json({ products })

  } catch (error) {
    console.error("Fetching all Products error : ", error.message)
    res.status(500).json({ message: "Serve Error", error: error.message })
  }
}



// GET featured Products
export const getFeaturedProducts = async (req, res) => {
  try {
    // check first in Redis
    let featuredProducts = await redis.get("featured_products")

    if (featuredProducts) {
      return res.status(200).json(JSON.parse(featuredProducts))
    }

    featuredProducts = await productModel.find({ isFeatured: true }).lean() // because of better performance plain javascript object

    if (!featuredProducts) {
      return res.status(400).json({ message: "No featured Products are found!" })
    }

    //store in redis
    await redis.set("featured_products", JSON.stringify(featuredProducts))

    res.status(200).json({ featuredProducts })


  } catch (error) {
    console.error("Error in GetFeaturedProducts :", error.message)
    res.status(500).json({ message: "Server Error", error: error.message })
  }
}


// Get Category Products
export const getProductByCategory = async (req, res) => {
  try {
    const { category } = req.params
    const productCategory = await productModel.find({ category })
    res.status(200).json({ productCategory })

  } catch (error) {
    console.log("Error in getProductByCateogry :", error.message)
    res.status(500).json({ message: "Server Error", error: error.message })
  }
}




// togglefeaturedproducts

export const toggleFeaturedProducts = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ message: "Products Not Found !" })
    }
    // Toggle the Product
    product.isFeatured = !product.isFeatured
    const updatedProduct = await product.save()

    await updatedFeaturedProductCache()

    res.status(200).json(updatedProduct)


  } catch (error) {
    console.log("Error in ToggleFeatureProuduct :", error)
    res.status(500).json({ message: "Server Error", error: error.message })
  }
}



 // update cache
async function updatedFeaturedProductCache() {
  try {
    // for the high performance and return the plain javascript objec
    const featuredProducts = await productModel.find({ isFeatured: true }).lean()

    await redis.set("featured_products", JSON.stringify(featuredProducts))

  } catch (error) {
    console.log("Error in update the cache function ")

  }

}



// Get recommendation
export const getRecommendedProducts = async (req, res) => {

  try {

    const recommendedProducts = await productModel.aggregate([
      { $sample: { size: 4 } },
      { $project: { _id: 1, name: 1, description: 1, image: 1, price: 1 }, },
    ])

    res.status(200).json(recommendedProducts)
  }
  catch (error) {
    console.log("Error in getRecommendedProducts : ", error.message)
    res.status(500).json({ message: "Server error", error: error.message })
  }

}






// create
export const createProducts=async (req,res)=>{
    try {
        const {name, description,price,image ,category}=req.body

        let cloudinaryResponse=null
        if(image){
            cloudinaryResponse=await cloudinary.uploader.upload(image,{folder:"products"})
        }

        const product= await productModel.create({
           name,
           description,
           price,
           image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url:"",
           category,
        })

       res.status(201).json(product)


    } catch (error) {
      console.error("Error in Creating products :",error.message)
      res.status(500).json({message:"Server Error ", error:error.message})

    }

}

// delete
export  const deleteProducts =async (req,res)=>{
      try {
        const product= await productModel.findById(req.params.id)
        if(!product){
            return res.status(404).json({message:"Product Not Found!"})
        }

       if(product.image){
            const publicId= product.image.split('/').pop().split('.')[0]
            try {
               await cloudinary.uploader.destroy(`products/${publicId}`)
               console.log("Delete the image from the cloudinary ")

            } catch (error) {
               console.log("Error in deleting img from Cloudinary",error)
            }
       }
       await productModel.findByIdAndDelete(req.params.id)
       res.status(200).json({message:"Product Deleted ! "})


      } catch (error) {
        console.log("Error in DeletingProducts :",error.message)
        res.status(500).json({message:"Server error",error:error.message})

      }
}