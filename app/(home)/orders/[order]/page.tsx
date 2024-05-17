import { getCartProducts } from '@/app/lib/data'
import React from 'react'
import OrderContainer from '@/app/ui/Order/OrderContainer'

const OrderDetails = async ({ params }: {
    params: { order: string }
}) => {
    const order = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/order/${params.order}`)
    const orderData = await order.json()
    const products = await getCartProducts({ cart: orderData.data.cart });

    return (
        <div className='md:my-10'>
            <div className='md:w-9/12 rounded-md mx-auto justify-between md:border-2 p-6 px-10 my-5'>
                <h1 className='text-2xl font-semibold pt-5'>Order Details</h1>
                <div className='flex flex-wrap justify-between'>
                    <div className='py-4'>
                        <div>
                            <h2 className='font-bold text-lg'>Shipping Info</h2>
                        </div>
                        <div className='flex gap-5 py-2'>
                            <div>
                                <p>
                                    <span className='font-semibold'>Address: </span>
                                    {orderData.data.shippingInfo.address}
                                </p>
                                <p>
                                    <span className='font-semibold'>City: </span>
                                    {orderData.data.shippingInfo.city}
                                </p>
                                <p>
                                    <span className='font-semibold'>State: </span>
                                    {orderData.data.shippingInfo.state}
                                </p>
                            </div>
                            <div>
                                <p>
                                    <span className='font-semibold'> Country: </span>
                                    {orderData.data.shippingInfo.country}
                                </p>
                                <p>
                                    <span className='font-semibold'> Pin Code: </span>
                                    {orderData.data.shippingInfo.pinCode}
                                </p>
                                <p>
                                    <span className='font-semibold'>Phone No: </span>
                                    {orderData.data.shippingInfo.phoneNo}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className=''>
                        <h2 className='font-bold text-lg'>Order Summary</h2>
                        <div className='flex flex-wrap justify-between h-8'>
                            <h6>Subtotal:</h6>
                            <span className='pl-2'>
                                ₹{(orderData.data.subTotal).toFixed(2)}
                            </span>
                        </div>
                        <div className='flex flex-wrap justify-between h-8'>
                            <h6>Discount:</h6>
                            <span className='pl-2'>
                                - ₹{(orderData.data.totalSavings).toFixed(2)}
                            </span>
                        </div>
                        <div className='flex flex-wrap justify-between h-8'>
                            <h6>Delivery:</h6>
                            <span className='pl-2'>
                                ₹0.00 <span className='line-through'>₹{(490).toFixed(2)}</span>
                            </span>
                        </div>
                        <div className='flex flex-wrap justify-between font-bold h-8'>
                            <h6>Total:</h6>
                            ₹{(orderData.data.finalPrice).toFixed(2)}
                        </div>
                    </div>
                </div>
            </div>
            {/* <OrderContainerHeader order={orderData.data} /> */}
            <div className='md:w-9/12 rounded-t-md mx-auto justify-between'>
                <OrderContainer cart={products} />
            </div>
        </div>
    )
}

export default OrderDetails