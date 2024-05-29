'use client'
import React, { useEffect, useContext, useState } from 'react'
import { AuthContext } from '@/app/context/authContext';
import Loading from '@/app/ui/Loading';
import { redirect, useRouter } from 'next/navigation';
import { cartResponseType } from '@/app/lib/definations';
import { createOrder } from '@/app/lib/action';
import { useFormState, useFormStatus } from 'react-dom';
import { BsExclamationCircle } from 'react-icons/bs'
import toast from 'react-hot-toast';
import Script from 'next/script';
import axios from 'axios';
import NotLoggedIn from '@/app/ui/NotLoggedIn';

const Page = () => {
  let content;
  const { token, isAuthenticated } = useContext(AuthContext);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();
  const handlePayment = async (order: string) => {
    if (!order || !token) return;
    const headers = {
      Authorization: `Bearer ${token}`
    }
    const paymentRes = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/payment/init`, { orderId: order }, {
      headers
    })
    const paymentInit = paymentRes.data.response
    var options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
      name: "Invently Pvt Ltd",
      currency: paymentInit.currency,
      amount: paymentInit.amount * 100,
      order_id: paymentInit.id,
      description: "Invently Cart Checkout",
      image: 'https://res.cloudinary.com/de4ultdbc/image/upload/v1713903619/z2yrszc8dqybey1itmw8.png',
      handler: async function (response: any) {
        setIsRedirecting(true);
        const payload = {
          orderId: order,
          razorpay_orderID: response.razorpay_order_id,
          razorpay_paymentID: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature
        }
        try {
          await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/payment/verify`, { ...payload }, {
            headers
          })
          toast.success("Payment Successful")
          router.push('/orders')
        } catch (error) {
          toast.error("Payment Failed")
        } finally{
          setIsRedirecting(false)
        }
      }
    };

    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.open()
  }

  if (!isAuthenticated || token === null || token === ' ') {
    if (isAuthenticated !== null && token !== ' ')
      content = <NotLoggedIn/>
    else
      content = <Loading />
  }
  else {
    content = <>{
      !isRedirecting ?
        <Checkout token={token} handlePayment={handlePayment} />
        : <Loading />
    }
      <Script src="https://checkout.razorpay.com/v1/checkout.js"></Script>
    </>
  }
  return content;
}

const Checkout = ({ token, handlePayment }: { token: string, handlePayment: (order: string) => Promise<void> }) => {
  let content;
  const initialState = { success: false, message: "", data: { token, order: " " } };
  const [isLoading, setIsLoading] = useState(true);
  const [cartData, setCartData] = useState<cartResponseType | null>(null);
  const [response, orderAction] = useFormState(createOrder, initialState);
  const input = "p-2 my-2 border-b border-gray-500 hover:border-black focus:border-black focus:outline-none w-full"

  useEffect(() => {
    if (response.success) {
      handlePayment(response.data.order)
    } else if (response.message === "Order value should be less than ₹500000. Please remove some items from cart") {
      toast.error(response.message)
    }
  }, [response, handlePayment])

  useEffect(() => {
    (async () => {
      const headers = {
        Authorization: `Bearer ${token}`
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/cart`, {
        headers,
        cache: 'no-store'
      })
      const cart: cartResponseType = await response.json();
      setCartData(cart);
      setIsLoading(false);
    })()
  }, [token])

  if (isLoading || !cartData)
    content = <Loading />

  else if (!cartData.success || !cartData.data.length || !cartData.data[0].cartItems.length)
    redirect(`/cart`)

  else {
    content =
      <div className='md:w-10/12 my-12 m-auto'>
        <form className='m-auto md:flex' action={orderAction}>
          <div className='flex flex-col md:w-7/12 m-auto rounded-sm px-6 md:p-10'>
            <h3 className='text-3xl'>Billing Details</h3>
            <label className="font-bold pt-5" htmlFor="address">Address</label>
            <input
              required
              className={input}
              type="type" name='address' placeholder='38119 Viva Run' />
            <label className="font-bold" htmlFor="city">City</label>
            <input
              required
              className={input}
              type="text" name='city' placeholder='Port Gwendolynport' />
            <label className="font-bold" htmlFor="state">State</label>
            <input
              required
              className={input}
              type="text" name="state" placeholder="Delaware" />
            <label className="font-bold" htmlFor="country">Country</label>
            <input
              required
              className={input}
              type="text" name="country" placeholder="USA" />
            <label className="font-bold" htmlFor="pinCode">Pin Code</label>
            <input
              required
              className={input}
              type="text" name="pinCode" placeholder="12345" />
            <label className="font-bold" htmlFor="phoneNo">Phone No.</label>
            <input
              required
              className={input}
              type="text" name="phoneNo" placeholder="+1-870-270-2470" />
            {response.message && response.message !== "Success" && (
              <div className='flex items-center mt-2'>
                <BsExclamationCircle className="text-red-500 mr-1" />
                <p className="text-sm text-red-500">{response.message}</p>
              </div>
            )}
          </div>
          <CartTotal cartData={cartData} />
        </form>
      </div>
  }
  return content;
}


const CartTotal = ({ cartData }: { cartData: cartResponseType }) => {
  const data = useFormStatus();
  return (
    <div className='md:shadow-2xl rounded-md bg-white h-fit md:w-1/4 min-w-fit md:ml-4 p-10 md:p-5 md:pt-12 md:sticky md:z-1000 md:top-10'>
      <div className='flex flex-wrap justify-between h-8'>
        <h6>Subtotal:</h6>
        <span className='pl-2 text-green-500'>
          ₹{(cartData.subTotal).toFixed(2)}
        </span>
      </div>
      <div className='flex flex-wrap justify-between h-8'>
        <h6>Discount:</h6>
        <span className='pl-2 text-red-500'>
          - ₹{(cartData.totalSavings).toFixed(2)}
        </span>
      </div>
      <div className='flex flex-wrap justify-between h-8'>
        <h6>Delivery:</h6>
        <span className='pl-2 text-green-500'>
          ₹0.00 <span className='line-through'>₹{(490).toFixed(2)}</span>
        </span>
      </div>
      <hr className='border-black my-2' />
      <div className='flex flex-wrap justify-between font-bold h-8'>
        <h6>Total:</h6>
        ₹{(cartData.finalprice).toFixed(2)}
      </div>
      <button
        disabled={data.pending}
        className='flex items-center justify-center bg-green-600 hover:bg-green-800 text-white rounded w-full p-2 my-2'>
        Checkout
        {data.pending && <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" className='h-5 w-5' viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
          <g transform="rotate(0 50 50)">
            <rect x={47} y={24} rx={3} ry={6} width={6} height={12} fill="#ffffff">
              <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.9166666666666666s" repeatCount="indefinite" />
            </rect>
          </g><g transform="rotate(30 50 50)">
            <rect x={47} y={24} rx={3} ry={6} width={6} height={12} fill="#ffffff">
              <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.8333333333333334s" repeatCount="indefinite" />
            </rect>
          </g><g transform="rotate(60 50 50)">
            <rect x={47} y={24} rx={3} ry={6} width={6} height={12} fill="#ffffff">
              <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.75s" repeatCount="indefinite" />
            </rect>
          </g><g transform="rotate(90 50 50)">
            <rect x={47} y={24} rx={3} ry={6} width={6} height={12} fill="#ffffff">
              <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.6666666666666666s" repeatCount="indefinite" />
            </rect>
          </g><g transform="rotate(120 50 50)">
            <rect x={47} y={24} rx={3} ry={6} width={6} height={12} fill="#ffffff">
              <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.5833333333333334s" repeatCount="indefinite" />
            </rect>
          </g><g transform="rotate(150 50 50)">
            <rect x={47} y={24} rx={3} ry={6} width={6} height={12} fill="#ffffff">
              <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.5s" repeatCount="indefinite" />
            </rect>
          </g><g transform="rotate(180 50 50)">
            <rect x={47} y={24} rx={3} ry={6} width={6} height={12} fill="#ffffff">
              <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.4166666666666667s" repeatCount="indefinite" />
            </rect>
          </g><g transform="rotate(210 50 50)">
            <rect x={47} y={24} rx={3} ry={6} width={6} height={12} fill="#ffffff">
              <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.3333333333333333s" repeatCount="indefinite" />
            </rect>
          </g><g transform="rotate(240 50 50)">
            <rect x={47} y={24} rx={3} ry={6} width={6} height={12} fill="#ffffff">
              <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.25s" repeatCount="indefinite" />
            </rect>
          </g><g transform="rotate(270 50 50)">
            <rect x={47} y={24} rx={3} ry={6} width={6} height={12} fill="#ffffff">
              <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.16666666666666666s" repeatCount="indefinite" />
            </rect>
          </g><g transform="rotate(300 50 50)">
            <rect x={47} y={24} rx={3} ry={6} width={6} height={12} fill="#ffffff">
              <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.08333333333333333s" repeatCount="indefinite" />
            </rect>
          </g><g transform="rotate(330 50 50)">
            <rect x={47} y={24} rx={3} ry={6} width={6} height={12} fill="#ffffff">
              <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite" />
            </rect>
          </g>
        </svg>}
      </button>
    </div>
  )
}

export default Page;