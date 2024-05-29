'use client'
import React from 'react'
import { usePathname, useRouter } from 'next/navigation';

const NotLoggedIn = () => {
    const router = useRouter();
    const pathname = usePathname();
    return (
        <div className='h-screen w-full flex flex-col align-center text-center justify-center'>
            <h1 className='text-xl m-4'>Whoops! Looks like you&#39;re not logged in.</h1>
            <button
                className='bg-blue-600 text-white p-2 px-5 text-lg my-2 rounded-md mx-auto'
                onClick={() => router.replace(`/login?redirectTo=${pathname}`)}>
                Login
            </button>
        </div>
    )
}

export default NotLoggedIn