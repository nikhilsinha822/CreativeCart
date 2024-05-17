import React from 'react'
import { orderCartProductType } from '@/app/lib/definations';
import Link from 'next/link';

const OrderContainerHeader = ({ order }: { order: orderCartProductType }) => {
    const createdAt = new Date(order.createdAt).toUTCString().split(' ');
    const date = createdAt[1] + ' ' + createdAt[2] + ', ' + createdAt[3];
    return (
      <div className='w-full md:w-9/12 hidden md:flex m-auto mb-0 rounded-t-md p-5 bg-gray-300 justify-between'>
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
          <Link 
          className='text-blue-600 hover:underline hover:text-blue-800'
          href={`/orders/${order._id}`}>View Order Details</Link>
        </div>
      </div>
    )
  }

export default OrderContainerHeader