import React, { useEffect } from 'react'
import { ShoppingCart, UserPlus, LogIn, LogOut, Lock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useUserStore } from '../store/useUserStore';
import { useCartStore } from '../store/useCartStore';

function Navbar() {
  const{user,logout}=useUserStore()
  const isAdmin= user?.role=="admin"
  const {cart} = useCartStore()

  return (
    <header className='fixed top-0 left-0 w-full bg-gray-900 bg-opacity-10 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-emerald-800'>
      <div className='container mx-auto px-4 py-3 '>
        <div className='flex justify-between items-center flex-wrap'>

          {/* <Link to="/" className='text-2xl font-bold text-emerald-400 items-center space-x-2 flex'><span className='text-3xl font-thin italic'>Z</span>enStore</Link> */}
          <Link to="/" className='text-2xl font-bold text-emerald-400 items-center space-x-2 flex'>Atul</Link>

          <nav className='flex items-center flex-wrap gap-4'>

          <Link to="/" className='text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out'>Home</Link>

            {user && (
              <Link to={"/cart"} className=' relative group'>
                <ShoppingCart className='inline-block mr-1 group-hover:text-emerald-400' size={22} />
                <span className='hidden sm:inline'>Cart</span>
                {cart.length > 0 && (
                  <span className='absolute -top-2 -left-2 bg-emerald-100 text-black rounded-full px-2 py-0.5 text-xs group-hover:bg-emerald-100 transition duration-300 ease-in-out'>
                    {cart.length}
                  </span>
                )}
              </Link>
            )}

            {/* if Admin is here then we see the dashborad in it */}
            {isAdmin && (
              <Link className='bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1 rounded-md font-medium transition duration-300 ease-in-out flex items-center' to={"/dashboard"}>
                <Lock className='inline-block mr-1' size={18} />
                <span className='hidden sm:inline'>Dashboard</span>
              </Link>
            )}

            {/* if User is there hten we the the logout then see the logIn page */}

            {user ?
              (
                <button
                onClick={logout}
                className='bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out' >
                  <LogOut size={18} />
                  <span className='hidden sm:inline ml-2'>Log Out</span>
                </button>
              )
                :
              (<>
                <Link
                 to={"/signup"}
                 className='bg-emerald-600 hover:bg-emerald-700  text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out'>
                <UserPlus className='mr-2' size={18} />
                  Sign Up
                </Link>

                <Link
                to={"/login"}
                className='bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out'>
                <LogIn className='mr-2' size={18} />
                    Login
                </Link>
              </>)
            }

          </nav>
        </div>
      </div>
    </header>
  )
}

export default Navbar