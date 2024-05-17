'use client'
import React, { Suspense, useContext, useEffect, useState } from 'react'
import Loading from '@/app/ui/Loading'
import { useRouter } from 'next/navigation'
import { AuthContext } from '@/app/context/authContext'
import { orderCartProductType } from '@/app/lib/definations'
import Image from 'next/image'
import { prepareOrder } from '@/app/lib/data'
import { v4 as uuid } from 'uuid'
import NotLoggedIn from '@/app/ui/NotLoggedIn'
import OrderContainer from '@/app/ui/Order/OrderContainer'
import OrderContainerHeader from '@/app/ui/Order/OrderHeader'
import toast from 'react-hot-toast'
import Link from 'next/link'

const Orders = () => {
  let content;
  const { token, isAuthenticated } = useContext(AuthContext);
  if (!isAuthenticated || token === null || token === ' ') {
    if (isAuthenticated !== null && token !== ' ') {
      content = <>
        <NotLoggedIn />
      </>
    }
    else {
      content = <Loading />
    }
  }
  else {
    content = <div>
      <Suspense fallback={<Loading />}>
        <OrderList token={token} />
      </Suspense>
    </div>
  }

  return content;
}

const OrderList = ({ token }: { token: string }) => {
  let content;
  const router = useRouter();
  const [confirmedOrder, setConfirmedOrder] = useState<orderCartProductType[]>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const confirmedOrder = await prepareOrder({ token });
        setConfirmedOrder(confirmedOrder);
      } catch (error) {
        toast.error('Something went wrong! Please try again later.')
      } finally {
        setLoading(false);
      }
    })()
  }, [token])

  if (loading)
    content = <Loading />
  else if (confirmedOrder === undefined || confirmedOrder.length === 0)
    content = <div className='h-screen w-full flex flex-col align-center text-center justify-center'>
      <Image className='mx-auto' src={"https://res.cloudinary.com/dbij2kd0c/image/upload/v1715282187/bn4gv50hoi92eucb4ouf.svg"} width={300} height={300} alt={"cartEmpty"} />
      <h1 className='text-xl'>Your Order List is empty!</h1>
      <button className='bg-blue-600 text-white p-2 px-5 text-lg my-2 rounded-md mx-auto' onClick={() => router.push('/')}>Shop Now</button>
    </div>
  else
    content = <div>
      {
        confirmedOrder.reverse().map((order) => {
          return <div className='md:my-10' key={uuid()}>
            <OrderContainerHeader order={order} />
            <div className='md:w-9/12 rounded-t-md mx-auto justify-between'>
              <Link className='md:hidden' href={`/orders/${order._id}`}>
                <OrderContainer cart={order.cart} />
              </Link>
              <div className='hidden md:block'>
                <OrderContainer cart={order.cart} />
              </div>
            </div>
          </div>
        })
      }
    </div>

  return content;
}

export default Orders