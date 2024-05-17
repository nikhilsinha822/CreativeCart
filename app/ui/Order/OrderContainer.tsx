'use client'
import { cartProductType, productType } from "@/app/lib/definations"
import { v4 as uuid } from 'uuid'
import Image from 'next/image'
import { useRouter } from "next/navigation"

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
    const router = useRouter();
    return (
        <div className='flex items-center border w-full p-5'>
            <Image
                className='p-4'
                src={product.images[0].url} width={150} height={150} alt={product.title} />
            <div>
                <h1 className='font-bold'>{product.title}</h1>
                <p className="w-3/4 text-gray-500 text-sm hidden md:block">{product.desc}</p>
                <button
                    onClick={() => router.push(`/${product._id}`)}
                    className="bg-blue-500 text-white px-3 py-2 rounded-md my-2 text-sm hidden md:block">Buy Again</button>
            </div>
        </div>
    )
}

export default OrderContainer;