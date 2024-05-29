'use client'
import React, { useEffect, useRef, useState } from 'react'
import { Suspense } from 'react'
import { useContext } from 'react'
import { AuthContext } from '@/app/context/authContext'
import { useRouter } from 'next/navigation'
import Loading from '@/app/ui/Loading'
import { cartStateType, cartItemStateType } from '@/app/lib/definations'
import Image from 'next/image'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { FiMinus, FiPlus } from "react-icons/fi";
import emptyCart from '@/app/assets/emptyCart.png'
import { prepareCart } from '@/app/lib/data'
import { FaLongArrowAltLeft } from "react-icons/fa";
import { FaLongArrowAltRight } from "react-icons/fa";
import { v4 as uuid } from 'uuid'
import NotLoggedIn from '@/app/ui/NotLoggedIn'

type cartPropsType = {
    item: cartItemStateType,
    cartItemsState: cartItemStateType[],
    updateCart: (cartItems: cartItemStateType[]) => Promise<number>,
    setCartItemsState: React.Dispatch<React.SetStateAction<cartItemStateType[]>>
}


const Cart = () => {
    let content;
    const { token, isAuthenticated } = useContext(AuthContext);
    if (!isAuthenticated || token === null || token === ' ') {
        if (isAuthenticated !== null && token !== ' ') {
            content = <NotLoggedIn />
        }
        else {
            content = <Loading />
        }
    }
    else {
        content = <div>
            <Suspense fallback={<Loading />}>
                <CartList token={token} />
            </Suspense>
        </div>
    }
    return content;
}
const CartList = ({ token }: { token: string }) => {
    let content;
    const [cart, setCart] = useState<null | cartStateType>(null);
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter();

    useEffect(() => {
        prepareCart({ token }).then((cart) => setCart(cart))
            .catch((err) => toast.error(err))
            .finally(() => setIsLoading(false))
    }, [token])

    if(isLoading)
        content = <Loading/>
    else if (cart === null)
        content = <div className='h-screen w-full flex flex-col align-center text-center justify-center'>
            <Image className='mx-auto' src={emptyCart} width={300} height={300} alt={"cartEmpty"} />
            <h1 className='text-xl'>Your cart is empty!</h1>
            <button className='bg-blue-600 text-white p-2 px-5 text-lg my-2 rounded-md mx-auto' onClick={() => router.push('/')}>Shop Now</button>
        </div>
    else
        content = <ProductList cart={cart} />

    return content;
}

const ProductList = ({ cart }: { cart: cartStateType }) => {
    const { token } = useContext(AuthContext);
    const router = useRouter();
    const [cartItemsState, setCartItemsState] = useState(cart.data.cartItems)
    const [cartPriceState, setCartPriceState] = useState({
        subTotal: cart.subTotal,
        totalSavings: cart.totalSavings,
        finalprice: cart.finalprice
    })
    const checkout = useRef<HTMLDivElement>(null);
    const cartId = cart.data._id
    const updateCart = async (cartItems: cartItemStateType[]) => {
        try {
            const res = await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/cart/${cartId}`,
                { cartItems }, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });
            setCartPriceState({
                subTotal: res.data.subTotal,
                totalSavings: res.data.totalSavings,
                finalprice: res.data.finalprice
            })
            return res.status
        } catch (err: any) {
            if (err.response.data.message === 'Cart validation failed: cartItems.0.quantity: Quantity cannot be smaller than one')
                toast.error('Quantity cannot be smaller than one')
            else
                toast.error(err.response.data.message)
            return 400
        }
    }
    const checkoutScroll = () => {
        if (!checkout.current) return;
        checkout.current.scrollIntoView({ behavior: 'smooth' })
    }
    cartItemsState.sort((a, b) => {
        return Date.parse(b.createdAt) - Date.parse(a.createdAt)
    });
    const handleCartProceed = () => {
        if (cartPriceState.finalprice > 500000) {
            toast.error('Cart value cannot exceed ₹500000. Please remove some items', {
                duration: 5000
            })
            return
        }
        router.push('/checkout')
    }
    return (
        <div className='flex flex-col md:flex-row md:p-6 bg-blue-50'>
            <div className='shadow-2xl p-4 rounded-md bg-white md:w-9/12'>
                <button
                    className='bg-green-500 w-fit text-white rounded p-2 m-4 flex items-center md:hidden ml-auto'
                    onClick={checkoutScroll}>Checkout &nbsp; <FaLongArrowAltRight /></button>
                {
                    cartItemsState.map((item, index) => {
                        return (
                            <div key={uuid()}>
                                <Product
                                    item={item}
                                    updateCart={updateCart}
                                    cartItemsState={cartItemsState}
                                    setCartItemsState={setCartItemsState}
                                />
                                <hr className='border mx-10' />
                            </div>
                        )
                    })
                }
                <button
                    className='bg-blue-600 hover:bg-blue-800 text-white rounded p-2 m-4 flex items-center'
                    onClick={() => router.push('/')}><FaLongArrowAltLeft /> &nbsp; Go to Products</button>
            </div>
            <div ref={checkout} className='md:shadow-2xl rounded-md bg-white h-fit md:w-1/4 min-w-fit md:ml-4 p-10 md:p-5 md:sticky md:z-1000 md:top-10'>
                <div className='flex flex-wrap justify-between h-8'>
                    <h6>Subtotal:</h6>
                    <span className='pl-2 text-green-500'>
                        ₹{(cartPriceState.subTotal).toFixed(2)}
                    </span>
                </div>
                <div className='flex flex-wrap justify-between h-8'>
                    <h6>Discount:</h6>
                    <span className='pl-2 text-red-500'>
                        - ₹{(cartPriceState.totalSavings).toFixed(2)}
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
                    ₹{(cartPriceState.finalprice).toFixed(2)}
                </div>
                <button
                    onClick={handleCartProceed}
                    className='bg-green-600 hover:bg-green-800 text-white rounded w-full p-2 my-2'>
                    Proceed
                </button>
            </div>
        </div>
    )
}

const Product = ({ item, cartItemsState, setCartItemsState, updateCart }: cartPropsType) => {
    const productData = item.product;

    const handleDelete = async () => {
        const cartItems = cartItemsState.filter((cartItem) => {
            return cartItem._id !== item._id
        })
        const res = await updateCart(cartItems);
        if (res === 200) {
            setCartItemsState((items) => items.filter((cartItem) => {
                return cartItem._id !== item._id
            }))
            toast.success("Item removed successfully!")
        }
    }
    return <div className='flex flex-col m-5 p-auto md:flex-row justify-between'>
        <div className='flex flex-row gap-4 mt-5 md:mt-0'>
            <Image src={productData.images[0].url} alt={productData.title} width={125} height={125} className='h-auto w-auto' />
            <div>
                <h1 className='font-bold text-md'>{productData.title}</h1>
                <span className='flex gap-2 items-center text-xl'>
                    <p className='font-medium text-sm'>₹{productData.price - productData.discountValue}</p>
                    {(productData.discountValue !== 0) && <p className='line-through text-gray-500 text-sm'>₹{productData.price + productData.discountValue}</p>}

                </span>
                <h1 className='text-gray-500 text-xs overflow-hidden overflow-ellipsis h-8'>{productData.desc}</h1>
            </div>
        </div>
        <div className='flex flex-row justify-between align-center md:flex-col mt-2'>
            <div className='w-1 h-1 hidden md:block'></div>
            <QuantityButtons
                item={item}
                updateCart={updateCart}
                cartItemsState={cartItemsState}
                setCartItemsState={setCartItemsState}
            />
            <button className='py-2 w-1/2 md:w-full font-semibold hover:text-blue-600' onClick={handleDelete}>REMOVE</button>
        </div>
    </div>
}

const QuantityButtons = ({ item, cartItemsState, setCartItemsState, updateCart }: cartPropsType) => {
    const [quantity, setQuantity] = useState(item.quantity)
    const [isLoading, setIsLoading] = useState(false)

    const handleIncrement = async () => {
        if (isLoading) return;
        setIsLoading(true)
        const cartItems = cartItemsState;
        const index = cartItems.findIndex((cartItem) => cartItem._id === item._id);
        cartItems[index].quantity += 1;
        setQuantity(quantity + 1)
        const res = await updateCart(cartItems);
        if (res === 200) {
            toast.success(`Quantity of ${item.product.title} set to ${quantity + 1} successfully!`)
            setCartItemsState(cartItems)
        } else {
            setQuantity(quantity - 1)
        }
        setIsLoading(false)
    }
    const handleDecrement = async () => {
        if (quantity === 1 || isLoading) return;
        const cartItems = cartItemsState;
        const index = cartItems.findIndex((cartItem) => cartItem._id === item._id);
        cartItems[index].quantity -= 1;
        setQuantity(quantity - 1);
        const res = await updateCart(cartItems);
        if (res === 200) {
            toast.success(`Quantity of ${item.product.title} set to ${quantity - 1} successfully!`)
            setCartItemsState(cartItems);
        } else {
            setQuantity(quantity + 1);
        }
        setIsLoading(false)
    }
    return <div className='flex flex-cols items-center md:justify-center text-center'>
        <button
            className='border border-black rounded-full aspect-square mx-3 w-6'
            onClick={handleDecrement}>
            <FiMinus className='m-auto' />
        </button>
        <div className='border border-black text-center w-12 py-1'>
            {quantity}
        </div>
        <button
            className='border border-black rounded-full aspect-square mx-3 w-6'
            onClick={handleIncrement}>
            <FiPlus className='m-auto' />
        </button>
    </div>
}


export default Cart