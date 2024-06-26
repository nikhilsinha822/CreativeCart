'use client'
import React, { useState } from 'react'
import Button from '@/app/ui/Button'
import { useContext } from 'react'
import { AuthContext } from '@/app/context/authContext'
import axios, { AxiosResponse } from 'axios'
import toast from 'react-hot-toast'
import { useRouter, usePathname } from 'next/navigation'
import Loader2 from '../Loader2'
import { handleDirectBuy } from '@/app/lib/action'

const BottomButtons = ({ product }: { product: string }) => {
  const { token, isAuthenticated } = useContext(AuthContext);
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false)
  const [isBuying, setIsBuying] = useState(false)
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
          toast.success('Product added to cart')
        } else {
          await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/cart`, {
            cartItems: [{
              product: product
            }]
          }, { headers })
        }
      } else {
        if (isAuthenticated !== null) router.replace(`/login?redirectTo=${pathname}`)
        console.log("This was unexpected. Something is Really wrong. Try again later.");
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false)
    }
  }

  const handlebuyNow = async () => {
    if(!token) return router.replace(`/login?redirectTo=${pathname}`);
    setIsBuying(true);
    const response = await handleDirectBuy(product, token);
    console.log(response);
    setIsBuying(false);
    if(response?.data) router.push(`/checkout?cart=${response.data._id}`);
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
      <button
        className='bg-blue-600 text-white p-3 rounded mt-8 hover:bg-blue-800 focus:outline-none focus:ring-1 focus:ring-black disabled:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50
            font-bold flex items-center justify-center text-center w-full text-sm'
        disabled={isBuying || isAuthenticated === null}
        onClick={handlebuyNow}
      >
        Buy Now
        {isBuying && <Loader2 />}
      </button>
    </div>
  )
}



export default BottomButtons