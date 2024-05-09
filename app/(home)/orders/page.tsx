'use client'
import React, { Suspense, useContext } from 'react'
import Loading from '@/app/ui/Loading'
import { useRouter } from 'next/navigation'
import { AuthContext } from '@/app/context/authContext'
import { cartProductType, orderCartProductType, productType } from '@/app/lib/definations'
import Link from 'next/link'
import Image from 'next/image'
import { prepareOrder } from '@/app/lib/data'
import { v4 as uuid } from 'uuid'
import NotLoggedIn from '@/app/ui/NotLoggedIn'

const Orders = () => {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <OrderList />
      </Suspense>
    </div>
  )
}

const OrderList = async () => {
  let content;
  const { token, isAuthenticated } = useContext(AuthContext);
  if (!isAuthenticated || token === null || token === ' ') {
    if (isAuthenticated !== null && token !== ' ') {
      content = <>
        <NotLoggedIn
          image={"emptyCart"}
          page={"Order"}
        />
      </>
    }
    else {
      content = <Loading />
    }
  }
  else {
    const confirmedOrder: orderCartProductType[] = await prepareOrder({ token });
    if (confirmedOrder === null || confirmedOrder.length === 0)
      content = <div className='h-screen w-full flex flex-col align-center text-center justify-center'>
        {/* <Image className='mx-auto' src={emptyCart} width={300} height={300} alt={"cartEmpty"} /> */}
        <h1 className='text-xl'>Your Order List is empty!</h1>
        {/* <button className='bg-blue-600 text-white p-2 px-5 text-lg my-2 rounded-md mx-auto' onClick={() => router.push('/')}>Shop Now</button> */}
      </div>
    else
      content = <div>
        {
          confirmedOrder.map((order) => {
            return <div key={uuid()}>
              <OrderContainerHeader order={order} />
              <div className='w-10/12 m-auto rounded-t-md p-5 justify-between'>
                <OrderContainer cart={order.cart} />
              </div>
            </div>
          })
        }
      </div>
  }

  return content;
}

const OrderContainerHeader = ({ order }: { order: orderCartProductType }) => {
  const createdAt = new Date(order.createdAt).toUTCString().split(' ');
  const date = createdAt[1] + ' ' + createdAt[2] + ', ' + createdAt[3];
  return (
    <div className='w-10/12 m-auto rounded-t-md p-5 bg-gray-300 flex justify-between'>
      <div>
        <h1 className='text-sm'>ORDER PLACED</h1>
        <h1>{date}</h1>
      </div>
      <div>
        <h1 className='text-sm'>TOTAL</h1>
        <h1>₹{order.finalPrice}</h1>
      </div>
      <div>
        <h1 className='text-sm'>SHIP TO</h1>
        <h1>{order.shippingInfo.address}</h1>
      </div>
      <div>
        <h1 className='text-sm'>ORDER ID #{order._id}</h1>
        <Link href={`/details?order=${order._id}`}>View Order Details</Link>
      </div>
    </div>
  )
}

const OrderContainer = ({ cart }: { cart: cartProductType }) => {
  return (
    <div>
      {
        cart.cartItems.map((item) => {
          return <div key={uuid()} className='flex justify-between'>
            <Product product={item} />
          </div>
        })
      }
    </div>
  )
}

const Product = ({ product }: { product: productType }) => {
  return (
    <div className='flex border p-5'>
      <Image
        className='p-4'
        src={product.images[0].url} width={100} height={100} alt={product.title} />
      <Link href={`/${product._id}`}>
        <h1>{product.title}</h1>
        <p>{product.desc}</p>
      </Link>
    </div>
  )
}

export default Orders