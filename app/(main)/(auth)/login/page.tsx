'use client'
import React, { useContext, useEffect } from 'react'
import { useFormState } from 'react-dom'
import { handleLogin } from '@/app/lib/auth'
import { AuthContext } from '@/app/context/authContext'
import { redirect, useSearchParams } from 'next/navigation'
import { BsExclamationCircle } from "react-icons/bs";
import Link from 'next/link'
import Button from '@/app/ui/Button'
import Image from 'next/image'

const Login = () => {
    const initialState = { message: "", accessToken: "", roles: [] };

    const searchParams = useSearchParams();
    const redirectTo = searchParams.get('redirectTo') || '/';
    console.log(redirectTo, searchParams);
    const { loginState } = useContext(AuthContext);
    const [response, loginAction] = useFormState(handleLogin, initialState);

    useEffect(() => {
        if (response.message === "Success") {
            loginState(response.accessToken, response.roles);
            redirect(redirectTo)
        }
    }, [response, redirectTo, loginState])

    return (
        <div className='flex justify-center md:mx-20 py-auto h-screen'>
            <div className="min-h-full flex flex-col justify-center items-center text-sm md:w-1/2">
                <form action={loginAction} className='flex flex-col md:w-2/3 border-2 p-10'>
                    <h1 className='font-bold text-2xl text-blue-900'>Login</h1>
                    <label className='font-bold mt-8' htmlFor="email">Email Address</label>
                    <input
                        type="text"
                        id="email"
                        name="email"
                        required
                        placeholder="you@example.com"
                        className='border border-gray-500 p-3 rounded focus:outline-none focus:ring-1 focus:ring-black'
                    />
                    <label className='font-bold mt-8' htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name='password'
                        required
                        placeholder="Enter your password"
                        className='border border-gray-500 p-3 rounded focus:outline-none focus:ring-1 focus:ring-black'
                    />
                    <Button>LOGIN</Button>
                    <p className='mt-4'>Don&apos;t have an account? <Link className='text-blue-500 underline' href={`/register?redirectTo=${redirectTo}`}>Register</Link></p>
                    {response.message && response.message !== "Success" && (
                        <div className='flex items-center mt-2'>
                            <BsExclamationCircle className="text-red-500 mr-1" />
                            <p className="text-sm text-red-500">{response.message}</p>
                        </div>
                    )}
                </form>
            </div>
            <Image src="https://res.cloudinary.com/dbij2kd0c/image/upload/v1711309408/5865_kvxp7t.jpg" width={500} height={1000} alt="image" className='w-1/2 h-auto my-auto hidden md:block' />
        </div>
    )
}

export default Login