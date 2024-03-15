'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { MdNavigateBefore } from "react-icons/md";
import { MdNavigateNext } from "react-icons/md";

const Carousel = () => {
  const [scrollPos, setScrollPos] = useState<Boolean>(false)
  const [scrollNeg, setScrollNeg] = useState<Boolean>(false)
  const [imagesUrl, setImageUrl] = useState<string[]>([
    "https://res.cloudinary.com/dusjaet8n/image/upload/v1710437585/50504080326686_pljnoz.webp",
    "https://res.cloudinary.com/dusjaet8n/image/upload/v1710437585/50504081145886_gjchye.webp",
    "https://res.cloudinary.com/dusjaet8n/image/upload/v1710437585/50504080392222_qgyeje.webp",
    "https://res.cloudinary.com/dusjaet8n/image/upload/v1710437585/50504081211422_rsngoy.webp",
    "https://res.cloudinary.com/dusjaet8n/image/upload/v1710437585/50504080457758_y2uaz4.webp",
    "https://res.cloudinary.com/dusjaet8n/image/upload/v1710437585/50504080523294_spswf8.webp",
    "https://res.cloudinary.com/dusjaet8n/image/upload/v1710437584/50504080883742_bwmwib.webp"
  ])
  useEffect(()=>{
    if(scrollNeg || scrollPos) return;
    const interval = setInterval(() => {
      handleNext()
    }, 3000);
    return () => clearInterval(interval);
  })
  const handlePrev = () => {
    if(scrollNeg || scrollPos) return;
    setScrollPos(true);
    const timeout  = setTimeout(() => {
      let copy = imagesUrl.slice(0, imagesUrl.length - 1);
      copy.unshift(imagesUrl[imagesUrl.length - 1]);
      setImageUrl(copy);
      setScrollPos(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }
  const handleNext = () => {
    if(scrollNeg || scrollPos) return;
    setScrollNeg(true);
    const timeout  = setTimeout(() => {
      setScrollNeg(false);
      let copy = imagesUrl.slice(1, imagesUrl.length);
      copy.push(imagesUrl[0]);
      setImageUrl(copy);
    }, 1000);
    return () => clearTimeout(timeout);
  }
  return (
    <div>
      <div className='overflow-x-hidden w-screen'>
      <button className='hidden lg:block' onClick={handlePrev}>
        <MdNavigateBefore className='text-6xl bg-gray-200 rounded-full absolute left-6 top-56 p-3 z-10' />
      </button>
      <button className='hidden lg:block' onClick={handleNext}>
        <MdNavigateNext className='text-6xl bg-gray-200 rounded-full absolute right-6 top-56 p-3 z-10' />
      </button>
        <div className={`flex items-center text-center justify-center ${(scrollNeg || scrollPos) && "transition duration-1000"} ${scrollNeg && "-translate-x-full"} ${scrollPos && "translate-x-full"}`}>
          {imagesUrl.map((url) => {
            return <div className='min-w-max'>
              <Image src={url} alt="carousel" className='min-w-max w-screen h-auto' width={1240} height={400} />
            </div>
          })}
        </div>
      </div>
    </div>
  )
}

export default Carousel