'use client'
import React, { useEffect, useState } from 'react'
import Button from '@/app/ui/Button'
import { useContext } from 'react'
import { AuthContext } from '@/app/context/authContext'
import axios, { AxiosError, AxiosResponse } from 'axios'
// import { redirect } from 'next/navigation'
import { useRouter } from 'next/navigation'
import Loader2 from '../Loader2'

const BottomButtons = ({ product }: { product: string }) => {
  const { token, isAuthenticated } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter();
  const addToCart = async () => {
    const headers = {
      Authorization: `Bearer ${token}`
    }
    try {
      setIsLoading(true)
      if (isAuthenticated) {
        const cartResponse: AxiosResponse = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/cart`, { headers })
        if (cartResponse.data.success) {
          const cart = cartResponse.data.data[0];
          const cartId = cart._id;
          cart.cartItems.push({
            product: product,
            quantity: 1
          })
          await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/cart/${cartId}`, {
            cartItems: cart.cartItems
          }, { headers })
        } else {
          await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/cart`, {
            cartItems: [{
              product: product
            }]
          }, { headers })
        }
      } else {
        if (isAuthenticated !== null) router.push('/login')
        console.log("This was unexpected. Something is Really wrong. Try again later.");
      }
    } catch (error: any) {
      console.log(error.response.data.message);
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <div className='flex gap-2'>
      <button
        className='bg-blue-600 text-white p-3 rounded mt-8 hover:bg-blue-800 focus:outline-none focus:ring-1 focus:ring-black disabled:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50
            font-bold flex items-center justify-center text-center w-full text-sm'
        disabled={isLoading || isAuthenticated === null}
        onClick={addToCart}
      >
        Add to Cart
        {isLoading && <Loader2 />}
      </button>
      <Button>Buy</Button>
    </div>
  )
}



export default BottomButtons