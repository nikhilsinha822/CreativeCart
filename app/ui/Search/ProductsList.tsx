// 'use client'
import React from 'react'
import Image from 'next/image';
import Link from 'next/link';
import { productType, productResponseType } from '../../lib/definations';
import Rating from '../Rating';
import Pagination from '../Pagination';

const ProductList = async ({ query, page }: { query: string, page: number }) => {
    const response = await fetch(`${process.env.BASE_URL}/api/v1/product?search=${query}&page=${page}&pageSize=12`)
    const productsResponse: productResponseType = await response.json();
    const products = productsResponse.data;

    let content;

    if (!products?.length) {
        content = <>
            <div className='h-screen flex flex-col items-center justify-center font-bold text-xl'>
                <Image
                    className='w-72'
                    src="https://res.cloudinary.com/dbij2kd0c/image/upload/v1711725021/7xm.xyz468119-removebg-preview_jbs27i.png" width={1000} height={1000} alt="No Products" />
                <div className="text-center mt-4">
                    <p className="text-lg text-gray-700">No products found</p>
                    <p className="text-gray-600">Please try searching for something else</p>
                </div>
            </div>
        </>
    } else {
        content = <div className='w-11/12 md:w-8/12 m-auto py-10'>
            <div className='bg-white width-full p-4  mb-10 flex justify-between items-center text-center'>
                <div>
                    {productsResponse.matchedProducts} results were found for <span className='font-bold px-1'>&#39;{query}&#39;</span>
                </div>
                <div>
                    <span className='text-gray-500'>Page</span> {Number(productsResponse.page)} of {productsResponse.matchedPages}
                </div>
            </div>
            <div className=''>

                <div className='grid grid-cols-2 md:grid-cols-3 gap-1 md:gap-5'>
                    {
                        products.map((product) => {
                            if (!product) return null;
                            return <Product key={product._id} product={product} />
                        })
                    }
                </div>
                <Pagination totalPages={productsResponse.matchedPages} />
            </div>
        </div>
    }
    return content;
}

const Product = ({ product }: { product: productType }) => {
    return (
        <div className='rounded-sm border bg-white p-3 text-sm'>
            <Link href={`/${product._id}`}>
                <Image
                    className='m-auto h-44 md:h-56'
                    src={product.images[0].url} width={800} height={800} alt={product.title} />
                <div className='mt-2 pt-2 border-t border-gray-400'>
                    <span className='flex gap-2 items-center'>
                        <p className='font-semibold'>Rs. {product.price - product.discountValue}</p>
                        {product.discountValue && <p className='line-through text-gray-500 text-sm'>Rs. {product.price + product.discountValue}</p>}
                    </span>
                    <Rating product={product} />
                    <p className='font-lightbold w-9/12'>{product.title}</p>
                </div>
            </Link>
        </div>
    )
}

export default ProductList