import React, { useEffect, useState } from 'react'
import LoadingSpinner from './LoadingSpinner'
import toast from 'react-hot-toast'
import axios from '../lib/Axios'
import ProductCard from './ProductCard'

function PeopleAlsoBought() {
 const[recommendation,setRecommendation]=useState([])
 const [loading,setLoading]=useState(true)

 useEffect(()=>{
   async function fetchRecommendation(){
      try {
        const response= await axios.get('/products/recommendations')
        setRecommendation(response.data)
      } catch (error) {
        toast.error(error.response?.data.message || "An error occurred fetching recommendations")
        console.log("Error Fetching Recommendation :",error.message)

      }finally{
        setLoading(false)
      }
   }
  fetchRecommendation()
 },[])




 if(loading) return  <LoadingSpinner/>

  return (
    <div className='mt-8'>
			<h3 className='text-2xl font-semibold text-emerald-400'>People also bought</h3>
			<div className='mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg: grid-col-3'>
				{recommendation.length >0 && recommendation.map((product) => (
					<ProductCard key={product._id} product={product} />
				))}
			</div>
		</div>
  )
}

export default PeopleAlsoBought