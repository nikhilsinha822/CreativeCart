'use client'
import { Suspense } from 'react';
import Loading from '@/app/ui/Loading';
import { AuthContext } from '@/app/context/authContext';
import { userResponseType } from '@/app/lib/definations';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useContext } from 'react';
import Address from '@/app/ui/Profile/Address';
import Sidebar from '@/app/ui/Profile/Sidebar';
import Profile from '@/app/ui/Profile/Profile';

const Page = () => {

    return (
        <div className='bg-gray-200'>
            <Suspense fallback={<Loading />}>
                <Dash />
            </Suspense>
        </div>
    )
}

const Dash = async () => {

    let content;
    const router = useRouter();
    const searchParams = useSearchParams();
    const link = searchParams.get('link') || "personal";
    const { token, isAuthenticated } = useContext(AuthContext);

    if (!isAuthenticated || token === null || token === ' ') {
        if (isAuthenticated !== null && token !== ' ') {
            content = <>
                <div className='h-screen w-full flex flex-col align-center text-center justify-center'>
                    <h1 className='text-xl'>Please login to view your profile!</h1>
                    <button className='bg-blue-600 text-white p-2 px-5 text-base my-2 rounded-md mx-auto' onClick={() => router.push('/login')}>Login</button>
                </div>
            </>
        }
        else {
            content = <Loading />
        }
    }
    else {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/profile/me`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            cache: 'no-cache'
        })
        const { user }: { user: userResponseType } = await response.json();
        content = <>
            <div className='md:flex'>
                <div className='md:w-1/4'>
                    <Sidebar user={user} />
                </div>
                {
                    link === 'personal' ?
                        <Profile user={user} token={token} /> :
                        link === 'address' ?
                            <Address user={user} token={token} /> :
                            <Profile user={user} token={token} />
                }
            </div>
        </>
    }
    return content;
}

export default Page