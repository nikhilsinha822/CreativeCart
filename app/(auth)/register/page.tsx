'use client'
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '@/app/context/authContext'
import Image from 'next/image'
import Button from '@/app/ui/Button'
import { useFormState } from 'react-dom'
import { BsExclamationCircle } from 'react-icons/bs'
import { handleRegister } from '@/app/lib/auth'
import { FaPencilAlt } from "react-icons/fa";
import Link from 'next/link'
import profile from '@/app/assets/profile.jpg'
import { redirect } from 'next/navigation'

const Register = () => {
  const initialState = { message: "", accessToken: "" };

  const [avatar, setAvatar] = useState("");
  const { loginState } = useContext(AuthContext);
  const [response, registerAction] = useFormState(handleRegister, initialState)

  useEffect(() => {
    if (response.message === "Success") {
      loginState(response.accessToken);
      redirect('/')
    }
  }, [response.message]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setAvatar(URL.createObjectURL(e.target.files[0]));
  };

  return <div className='flex justify-center md:mx-20 py-auto min-h-screen'>
    <Image src="https://res.cloudinary.com/dbij2kd0c/image/upload/v1711309395/6666912_q36wmn.jpg" width={1000} height={1000} alt="register" className='w-1/2 h-auto my-auto hidden md:block' />
    <div className="min-h-full flex flex-col justify-center items-center text-sm md:w-1/2 my-10">
      <form action={registerAction} className='flex flex-col md:w-2/3 border-2 p-10'>
        <h1 className='font-bold text-2xl text-blue-900'>Register</h1>
        <label className='font-bold flex items-center justify-center mt-5 border border-gray-500 p-3 rounded focus:outline-none focus:ring-1 focus:ring-black hover:cursor-pointer hover:text-blue-400' htmlFor="avatar">
          <Image src={avatar || profile} width={30} height={30} alt="avatar" className='rounded-full mx-5 aspect-square w-auto h-auto max-w-8 min-w-8' />
          Choose Avatar
          <FaPencilAlt className='ml-2 mr-5 cursor-pointer' />
        </label>
        <input
          type="file"
          id="avatar"
          name="avatar"
          accept='image/*'
          onChange={handleAvatarChange}
          // required
          className='hidden'
        />
        <label className='font-bold mt-8' htmlFor="email">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          required
          placeholder="Enter your name"
          className='border border-gray-500 p-3 rounded focus:outline-none focus:ring-1 focus:ring-black'
        />
        <label className='font-bold mt-8' htmlFor="email">Email Address</label>
        <input
          type="email"
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

        <Button>SIGNUP</Button>
        <p className='mt-4'>Already have an account? <Link className='text-blue-500 underline' href="/login">Login</Link></p>
        {response.message && response.message !== "Success" && (
          <div className='flex items-center mt-2'>
            <BsExclamationCircle className="text-red-500 mr-1" />
            <p className="text-sm text-red-500">{response.message}</p>
          </div>
        )}
      </form>
    </div>
  </div>
}

export default Register