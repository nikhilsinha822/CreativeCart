'use client'
import React from 'react'

const DealsAndOffer = () => {

    const products = [{
        name: "Headphones",
        url: "https://res.cloudinary.com/dbij2kd0c/image/upload/v1710547960/headphones_v8zujk.webp",
        discount: "25%"
    },{
        name: "Camera", 
        url: "https://res.cloudinary.com/dbij2kd0c/image/upload/v1710547960/camera_f7arqf.webp",
        discount: "40%"
    },{
        name: "Laptops",
        url: "https://res.cloudinary.com/dbij2kd0c/image/upload/v1710547960/lpatops_xwu42v.webp",
        discount: "15%"
    },{
        name: "Smart Watches",
        url: "https://res.cloudinary.com/dbij2kd0c/image/upload/v1710547960/smartWatches_ig1v2g.webp",
        discount: "25%"
    },{
        name: "Phones",
        url: "https://res.cloudinary.com/dbij2kd0c/image/upload/v1710547960/phones_od5wq0.webp",
        discount: "25%"
    }];

    return (
        <div className='md:mx-10 my-5 md:rounded-md bg-white'>
            <div className='w-11/12 m-auto font-bold text-2xl pt-6'>
                Deals and Offers
            </div>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 md:w-11/12 m-auto overflow-hidden rounded-md py-5'>
                {products.map((product, index) => {
                    return <div key={index} className='flex flex-col text-center justify-center items-center border border-gray-300 min-w-fit'>
                        <div className='h-36 p-5 md:h-40 lg:h-56 flex items-center justify-center text-center'>
                            <img className='w-7/12 lg:w-9/12 h-auto' src={product.url} alt="product" />
                        </div>
                        <div>{product.name}</div>
                        <div className='bg-red-100 text-red-600 text-sm font-bold p-1 px-3 m-3 rounded-full'>-{product.discount}</div>
                    </div>
                })}
            </div>
        </div>
    )
}

export default DealsAndOffer