'use client'
import { Suspense } from 'react';
import Loading from '@/app/ui/Loading';
import { AuthContext } from '@/app/context/authContext';
import { userResponseType } from '@/app/lib/definations';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useContext, useState, useEffect } from 'react';
import Address from '@/app/ui/Profile/Address';
import Sidebar from '@/app/ui/Profile/Sidebar';
import Profile from '@/app/ui/Profile/Profile';
import NotLoggedIn from '@/app/ui/NotLoggedIn';

const Page = () => {
    let content;
    const router = useRouter();
    const { token, isAuthenticated } = useContext(AuthContext);

    if (!isAuthenticated || token === null || token === ' ') {
        if (isAuthenticated !== null && token !== ' ') {
            content = <NotLoggedIn/>
        }
        else {
            content = <Loading />
        }
    }
    else {
        content = <div className='bg-gray-200'>
            <Suspense fallback={<Loading />}>
                <Dash token={token} />
            </Suspense>
        </div>
    }

    return content;
}

const Dash = ({ token }: { token: string }) => {
    const [user, setUser] = useState<userResponseType | null>(null);
    const searchParams = useSearchParams();
    const link = searchParams.get('link') || "personal";

    useEffect(() => {
        const fetchUser = async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/profile/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                cache: 'no-cache'
            })
            const { user }: { user: userResponseType } = await response.json();
            setUser(user);
        }
        fetchUser();
    }, [token])

    if (!user) return <Loading />
    return <>
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

export default Page