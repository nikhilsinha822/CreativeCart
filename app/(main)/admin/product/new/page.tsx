'use client'
import React, { useContext, useState, useRef, useEffect } from 'react'
import { useFormState } from 'react-dom'
import { addNewProduct } from '@/app/lib/action'
import { AuthContext } from '@/app/context/authContext'
import { useRouter } from 'next/navigation'
import Loading from '@/app/ui/Loading'
import { v4 as uuid } from 'uuid'
import Image from 'next/image'
import { FaPlus } from 'react-icons/fa'
import Button from '@/app/ui/Button'

const AddProduct = () => {
  const initialState = { success: false, token: ' ', error: false, data: null, message: '' }
  const { token, roles, isAuthenticated } = useContext(AuthContext);
  const [Images, setImages] = useState<File[]>([]);
  const [response, addProductAction] = useFormState(addNewProduct, initialState)
  const error = useRef<HTMLDivElement>(null);

  let content;
  const router = useRouter();

  useEffect(() => {
    if (response.success) {
      router.push(`/${response.data}`)
    }
    else if (response.error) {
      error.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [router, response])

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setImages(Array.from(e.target.files));
  };

  if (!isAuthenticated || token === null || token === ' ') {
    if (isAuthenticated !== null && token !== ' ') {
      content = <>
        <div className='h-screen w-full flex flex-col align-center text-center justify-center'>
          <h1 className='text-xl'>Please login!</h1>
          <button className='bg-blue-600 text-white p-2 px-5 text-lg my-2 rounded-md mx-auto' onClick={() => router.push('/login')}>Login</button>
        </div>
      </>
    }
    else {
      content = <Loading />
    }
  }

  else if (roles && !roles.includes('Admin'))
    router.push('/')

  else {
    response.token = token;
    content = <div className='md:w-3/4 mx-auto my-20 p-10 border'>
      <h1 className='font-bold text-2xl my-5'>Product Information</h1>
      <form className='flex flex-col' action={addProductAction}>
        <div className='border border-gray-300 rounded'>
          <div className='font-bold text-lg m-5'>
            Images
          </div>
          <div className='flex flex-wrap items-center justify-center text-center gap-2'>{
            Images && Images.map((image, ind) => <div key={uuid()} className='border rounded-lg w-24 h-24 flex items-center justify-center'>
              <Image className='max-w-full max-h-full'
                src={URL.createObjectURL(image)} width={50} height={50} alt={"uploads"} />
            </div>
            )
          }
            <label htmlFor="images" className='flex items-center justify-center text-center gap-2'>
              {!Images.length && <div className='flex justify-center items-center gap-2 m-5 mb-10 hover:cursor-pointer'><FaPlus /> Add Images</div>}
            </label>
          </div>
          <div className='text-right m-5'>
            {
              Images.length ? <label htmlFor="images" className='text-blue-500 hover:text-blue-700 text-sm underline hover:cursor-pointer'>Change Images</label> : <></>
            }
          </div>
        </div>
        <input
          className='hidden'
          onChange={handleImages}
          type="file" name="images" id="images" accept='image/*' multiple />
        <label className='font-bold mt-8' htmlFor="title">Title</label>
        <input
          className='border border-gray-300 p-3 rounded focus:outline-none focus:ring-1 focus:ring-black'
          type="text" name="title" />
        <label className='font-bold mt-8' htmlFor="summary">Summary</label>
        <input
          className='border border-gray-300 p-3 rounded focus:outline-none focus:ring-1 focus:ring-black'
          type="text" name="summary" />
        <label className='font-bold mt-8' htmlFor="desc">Description</label>
        <input
          className='border border-gray-300 p-3 rounded focus:outline-none focus:ring-1 focus:ring-black'
          type="text" name="desc" />
        <label className='font-bold mt-8' htmlFor="price">Price(INR)</label>
        <input
          className='border border-gray-300 p-3 rounded focus:outline-none focus:ring-1 focus:ring-black'
          type="text" name="price" />
        <label className='font-bold mt-8' htmlFor="stock">Stock</label>
        <input
          className='border border-gray-300 p-3 rounded focus:outline-none focus:ring-1 focus:ring-black'
          type="number" name="stock" />
        <label className='font-bold mt-8' htmlFor="discountType">Discount Type</label>
        <select
          className='border border-gray-300 p-3 rounded focus:outline-none focus:ring-1 focus:ring-black'
          name="discountType" id="">
          <option value="none">None</option>
          <option value="percent">Percent</option>
          <option value="amount">Amount</option>
        </select>
        <label className='font-bold mt-8' htmlFor="discountValue">Discount Value</label>
        <input
          className='border border-gray-300 p-3 rounded focus:outline-none focus:ring-1 focus:ring-black'
          type="number" name="discountValue" />
        {
          response && response.error && <div ref={error} className='flex items-center mt-2'>
            <p className="text-sm text-red-500">{response.message}</p>
          </div>
        }
        <Button>Submit</Button>
      </form>
    </div>
  }
  return content;
}

export default AddProduct