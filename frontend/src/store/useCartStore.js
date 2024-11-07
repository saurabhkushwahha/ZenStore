import { create } from 'zustand'
import axios from '../lib/Axios'
import { toast } from 'react-hot-toast'


export const useCartStore = create((set, get) => ({
  cart: [],
  coupon: null,
  total: 0,
  subTotal: 0,
  isCouponApplied: false,

 //getCoupon
  getCoupon:async()=>{
    try {
      const response= await axios.get('/coupon')
      set({coupon:response.data})
    } catch (error) {
      console.error("Error GETCoupon :",error.message)
    }
  },


  //applycoupon
  applyCoupon :async (code)=>{
    try {
      const response= await axios.post('/coupon/validate',{code})
      set({coupon:response.data, isCouponApplied:true})
      get().calculateTotal()
      toast.success("Coupon Applied Successfully!")
    } catch (error) {
     console.error("Error ApplyCoupon :",error.message)
     toast.error(error.response?.data?.message || "Failed to apply Coupon!")
    }
  },


   //remove Coupon
   removeCoupon: ()=>{
    set({coupon:null,isCouponApplied:false});
    get().calculateTotal()
    toast.success("Coupon Removed!")
   },


  // getCartItem
  getCartItem: async () => {
    try {
      const response = await axios.get('/cart')
      set({ cart: response.data })
      get().calculateTotal()
    } catch (error) {
      set({ cart: [] })
      toast.error(error.response?.data?.message || "An error occurred !")
    }
  },


  // add to Cart
  addToCart: async (id) => {
    try {
      await axios.post('/cart', { productId: id })
      toast.success("ADD To Cart !")
      set((prevState) => ({
        cart: prevState.cart.some((item) => item._id == id) ?
          prevState.cart.map((item) => item._id == id ? { ...item, quantity: item.quantity + 1 } : item) :
          [...prevState.cart, { _id: id, quantity: 1 }]
      }))

      get().calculateTotal()

    } catch (error) {
      console.log("Error in the AddToCart :", error.message)
      toast.error(error.response?.data?.message || "An error Occurred!")
    }
  },

  // calculate Total
  calculateTotal: () => {
    const { cart, coupon } = get();
    const subTotal = cart.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    let total = subTotal;
    if (coupon) {
      const discount = subTotal * (coupon.discountPercentage / 100);
      total = subTotal - discount
    }
    set({ total, subTotal });
  },

  // clear the cart after the  payment done
  clearCart: async ()=>{
    set({cart:[],coupon:null,total:0,subTotal:0})
  },

  // updateQuantity
  updateQuantity: async (id, ChangeQuantity) => {
    if (ChangeQuantity === 0) {
      get().removeAllFromCart(id)
      return
    }

    await axios.put(`/cart/${id}`, { ChangeQuantity })

    set((prevState) => ({
      cart: prevState.cart.map((item) => item._id === id ? { ...item, quantity: ChangeQuantity } : item)
    }))

    get().calculateTotal()
  },

  // removeAllFromCart
  removeAllFromCart: async (productId) => {
    await axios.delete('/cart', { productId })
    set((prevState) => ({
      cart: prevState.cart.filter((item) => item._id !== productId)
    }))
    get().calculateTotal()
  },

}))

