'use client'
import React from 'react'
import { useRouter } from 'next/navigation';

const NotLoggedIn = ({ image, page }: { image: string, page: string }) => {
    // const router = useRouter();
    return (
        <div className='h-screen w-full flex flex-col align-center text-center justify-center'>
            {/* <Image className='mx-auto' src={image} width={300} height={300} alt={"cartEmpty"} /> */}
            <h1 className='text-xl'>Your {page} List is empty!</h1>
            {/* <button className='bg-blue-600 text-white p-2 px-5 text-lg my-2 rounded-md mx-auto' onClick={() => router.push('/')}>Shop Now</button> */}
        </div>
    )
}

export default NotLoggedIn