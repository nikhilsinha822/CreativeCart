import React, { Suspense } from 'react'
import { productType } from '@/app/lib/definations'
import ImageSection from '@/app/ui/Product/ImageSection'
import Rating from '@/app/ui/Rating'
import BottomButtons from '@/app/ui/Product/BottomButtons'
import Loading from '@/app/ui/Loading'
import Image from 'next/image'
import Link from 'next/link'


const page = ({ params }: { params: { product: string } }) => {
    return (
        <div className='md:bg-blue-50'>
            <div className='h-0.5'></div>
            <Suspense fallback={<Loading />}>
                <Product product={params.product} />
            </Suspense>
            <Suspense fallback={<Loading />}>
                <RelatedProducts product={params.product} />
            </Suspense>
            <div className='h-5'></div>
        </div>
    )
}

const Product = async ({ product }: { product: string }) => {
    const resposne = await fetch(`${process.env.BASE_URL}/api/v1/product/${product}`)
    const productResponse: { success: Boolean, data: productType } = await resposne.json();
    const productData = productResponse?.data;

    if (!productResponse.success)
        return <h1>productResponse not found</h1>
    return <div className='grid md:grid-cols-2 m-5 md:mx-10 md:pt-16 md:my-12 bg-white'>
        <ImageSection image={productData.images} />
        <div className='flex flex-col gap-4 mt-5 md:mt-0 md:w-9/12 mx-auto'>
            <h1 className='font-bold text-xl'>{productData.title}</h1>
            <Rating product={productData} />
            <span className='flex gap-2 items-center text-xl'>
                <p className='font-semibold'>₹{productData.price - productData.discountValue}</p>
                {productData.discountValue && <p className='line-through text-gray-500 text-sm'>₹{productData.price + productData.discountValue}</p>}
            </span>
            {productData.stock > 0 ? <p className='text-green-500'>In Stock</p> : <p className='text-red-500'>Out of Stock</p>}
            <p>{productData.desc}</p>
            <hr className='border border-gray-500' />
            <BottomButtons product={product} />
        </div>
        <div className='h-10'></div>
    </div>

}

const RelatedProducts = async ({ product }: { product: string }) => {
    const productResponse = await fetch(`${process.env.BASE_URL}/api/v1/product/${product}`);
    const productJson = await productResponse.json();
    const productData = productJson.data;

    const search = productData.title.split(' ');

    const resposne = await fetch(`${process.env.BASE_URL}/api/v1/product?search=${search[search.length - 1]}&pageSize=5`, {
        cache: 'no-store'
    });
    const searchResponse = await resposne.json();
    const searchProductData = searchResponse.data;

    if(searchProductData.length < 5){
        return <></>
    }

    return (
        <div className='md:mx-10 p-5 bg-white'>
            <h1 className='text-2xl font-bold my-5'>
            Similar Products
            </h1>
            {
                <div className='grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-5 md:gap-5'>
                    {
                        searchProductData.map((product: productType) => {
                            return <Card key={product._id} product={product} />
                        })
                    }
                </div>
            }
        </div>
    )
}

const Card = ({ product }: { product: productType }) => {
    return <div className='bg-white p-3 rounded-sm border shadow-sm'>
        <Link href={`/${product._id}`}>
            <Image className='aspect-square' src={product.images[0].url} alt={product.title} width={500} height={500} />
            <p className='font-bold text-sm pb-1 pt-3'>₹{product.price}</p>
            <p className='text-gray-400 text-sm'>{product.title}</p>
        </Link>
    </div >
}

export default page