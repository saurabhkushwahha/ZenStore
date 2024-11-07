import {create} from 'zustand'
import axios from '../lib/Axios'
import {toast} from 'react-hot-toast'

export const useUserStore=create((set,get)=>({

  user:null,
  isLoading:false,
  checkingAuth:true,

  // signup
  signUp:async({email,password,name,confirmPassword})=>{
     set({isLoading:true})
     if(password!==confirmPassword){
        set({isLoading:false})
        return toast.error("Password do not match")
     }

     try {
      const response= await axios.post("/auth/signup",{name,email,password})
      set({user:response.data, isLoading:false})

     } catch (error) {
      set({isLoading:false})
      toast.error(error.response.data.message || "An error occurred")
     }
  },

  //login
  login:async({email,password})=>{
     set({isLoading:true})
     try {
      const response=await axios.post('/auth/login',{email,password})
      set({user:response.data.user,isLoading:false})
      toast.success(response.data.message)

     } catch (error) {
       set({isLoading:false})
       toast.error(error.response.data.message || "An error occurred")
     }
  },

  //logout
  logout: async()=>{
     try {
       const response= await axios.get('/auth/logout')
       set({user:null})
       toast.success(response.data.message)
     } catch (error) {
      set({isLoading:false})
      toast.error(error.response.data.message || "An error occurred")
     }
  },


  //checAuth
  checkAuth:async()=>{
     set({checkingAuth:true})
     try {
      const response = await axios.get('/auth/getProfile')
       set({checkingAuth:false,user:response.data})
     } catch (error) {
        set({user:null, checkingAuth:false})
     }
  },

  //
   refreshToken : async ()=>{
       // Prevent multiple refresh
      if(get().checkAuth) return
      try {
        const response= await axios.get('/auth/refreshToken')
        set({checkingAuth:false})
        return response.data
      } catch (error) {
        set({user:null, checkingAuth:false})
        throw error;
      }
   }

}))


 // TODO : Implements to axios interceptors for refreshing the access token

 let refreshPromise=null

 axios.interceptors.response.use(
    (response)=>response,

   async (error)=>{
      const originalRequest=error.config

      if(error.response?.status==401 && !originalRequest._retry){
          originalRequest._retry=true
          try {
            // If a refresh is already in progress , wait for it to complete
            if(refreshPromise){
               await refreshPromise;
               return axios(originalRequest)
            }

           //Start a new refresh token
            refreshPromise=useUserStore.getState().refreshToken()
            await refreshPromise
            refreshPromise=null
            return axios(originalRequest)

          } catch (refreshError) {
            // If refresh fails, redirect to login and handle as needed
            useUserStore.getState().logout()
            return Promise.reject(refreshError)
          }
      }
     return Promise.reject(error)
   }
 )