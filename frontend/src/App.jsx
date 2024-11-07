import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import Navbar from './components/Navbar'
import { Toaster } from 'react-hot-toast'
import { useUserStore } from './store/useUserStore'
import Dashboard from './pages/Dashboard'
import CategoryPage from './pages/CategoryPage'
import CartPage from './pages/CartPage'
import PurchaseSuccessPage from './pages/PurchaseSuccessPage'
import PurchaseCancelPage from './pages/PurchaseCancelPage'
import { useCartStore } from './store/useCartStore'
function App() {
  const { user, checkAuth } = useUserStore()
  const { getCartItem } = useCartStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    getCartItem()
  }, [getCartItem])



  return (
    <div className='min-h-screen bg-gray-900 text-white relative overflow-hidden'>

      {/* BackGround Images */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute inset-0'>
          <div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(10,10,10,0.7)_0%,rgba(60,60,60,0.8)_30%,rgba(0,0,0,0.1)_100%)]
'></div>
        </div>
      </div>
      <div className='relative z-50 pt-20'>
        <Navbar />
        <Routes>
          <Route path='/login' element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path='/signup' element={!user ? <SignUp /> : <Navigate to="/" />} />

          <Route path='/' element={<Home />} />
          <Route path='/category/:category' element={<CategoryPage />} />
          <Route path='/cart' element={user ? <CartPage /> : <Navigate to="/login" />} />
          <Route path='/dashboard' element={user?.role == "admin" ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path='/purchase-success' element={<PurchaseSuccessPage />} />
          <Route path='/purchase-cancel' element={<PurchaseCancelPage />} />

        </Routes>
      </div>

      <Toaster
        toastOptions={{
          success: {

            position: "top-center",
            style: {
              background: '#000000',
              color: '#fff',
              animation: 'ease-in-out 1',

            },
          },
          error: {
            position: "top-center",
            style: {
              background: 'black',
              color:'red'
            },
          },
        }}
      />
    </div>
  )
}

export default App
