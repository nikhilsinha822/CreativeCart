import React, { Suspense } from 'react'
import { productType } from '@/app/lib/definations'
import ImageSection from '@/app/ui/Product/ImageSection'
import Rating from '@/app/ui/Rating'
import BottomButtons from '@/app/ui/Product/BottomButtons'


const page = ({ params }: { params: { product: string } }) => {
    return (
        <div>
            <Suspense fallback={<div>Product Loading.....</div>}>
                <Product product={params.product} />
            </Suspense>
            <Suspense fallback={<div>Loading...</div>}>
                <RelatedProducts product={params.product}/>
            </Suspense>
        </div>
    )
}

const Product = async ({ product }: { product: string }) => {
    const resposne = await fetch(`${process.env.BASE_URL}/api/v1/product/${product}`)
    const productResponse: { success: Boolean, data: productType } = await resposne.json();
    const productData = productResponse?.data;

    if (!productResponse.success)
        return <h1>productResponse not found</h1>
    return <div className='grid md:grid-cols-2 m-5 md:my-12'>
        <ImageSection image={productData.images} />
        <div className='flex flex-col gap-4 mt-5 md:mt-0 md:w-9/12 mx-auto'>
            <h1 className='font-bold text-xl'>{productData.title}</h1>
            <Rating product={productData} />
            <span className='flex gap-2 items-center text-xl'>
                <p className='font-semibold'>Rs. {productData.price - productData.discountValue}</p>
                {productData.discountValue && <p className='line-through text-gray-500 text-sm'>Rs. {productData.price + productData.discountValue}</p>}
            </span>
            {productData.stock > 0 ? <p className='text-green-500'>In Stock</p> : <p className='text-red-500'>Out of Stock</p>}
            <p>{productData.desc}</p>
            <hr className='border border-gray-500'/>
            <BottomButtons />
        </div>
    </div>

}

const RelatedProducts = async ({ product }: { product: string }) => {
    const resposne = await fetch(`${process.env.BASE_URL}/api/v1/product?search=mobile&pageSize=4`);
    const productResponse: { success: Boolean, data: productType[] } = await resposne.json();
    const productData = productResponse?.data;

    return (
        <div>
            <h1>Related Products</h1>
        </div>
    )
}

export default page