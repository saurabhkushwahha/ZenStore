import { create } from 'zustand'
import axios from '../lib/Axios'
import { toast } from 'react-hot-toast'

export const useProductStore = create((set, get) => ({
  products: [],
  loading: false,

  setProducts: (products) => set({ products }),

  //create Product
  createProduct: async (productData) => {
    set({ loading: true })
    try {
      const response = await axios.post("/products", productData)
      set((prevState) => ({
        products: [...prevState.products, response.data],
        loading: false
      }))
    } catch (error) {
      toast.error(error?.response)
      set({ loading: false })
    }

  },


  // get all Products
  fetchAllProducts: async () => {
    set({ loading: true })
    try {
      const response = await axios.get('/products')
      // console.log(response.data.products,"product Store")
      set({products:response.data.products})
      set({loading:false})
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.error || "Failed to Fetch Products")
      set({loading:false})
    }
  },


  // togglefeaturedProducts
  toggleFeaturedProduct:async (id)=>{
     set({loading:true})
     try {
      const response = await axios.patch(`/products/${id}`)
      set((prevProducts)=>({
        products: prevProducts.products.map((product)=>
          product._id==id ? {...product,isFeatured:response.data.isFeatured} :product
        ),
        loading:false
      }))

     } catch (error) {
        toast.error(error.response?.data?.error || "Failed to Update Products")
       set({loading:false})
     }
  },

//delete
   deleteProduct:async (id)=>{
       set({loading:true})
       try {
        const response =await axios.delete(`/products/${id}`)
         set((prevProducts)=>({
            products:prevProducts.products.filter((product)=>product._id!==id),
            loading:false
         }))
         toast.success(response.data.message)
       } catch (error) {
         console.log(error.response)
         set({loading:false})
       }
   },

   // get Category products

   fetchCategoryProducts:async(category)=>{
    set({loading:true})
      try {
        const response= await axios.get(`/products/category/${category}`)
         set({products:response.data.productCategory})
        set({loading:false})

      } catch (error) {
        toast.error(error.response.data.error ||"Failde to Fetch Category")
        set({loading:false})
      }
   },

   // fetch all featured Products
   featchAllFeaturedProducts: async()=>{
    set({loading:true})
     try {
      const response= await axios.get('/products/featured')
      set({products:response.data})
      set({loading:false})

     } catch (error) {
      console.log("Error FeatchFeaturedProducts: ",error.message)
      set({loading:false})
     }
   }

}))