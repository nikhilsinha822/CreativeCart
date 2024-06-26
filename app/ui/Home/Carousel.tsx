'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { MdNavigateBefore } from "react-icons/md";
import { MdNavigateNext } from "react-icons/md";
import {v4 as uuid} from 'uuid';

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
  useEffect(() => {
    if (scrollNeg || scrollPos) return;
    const interval = setInterval(() => {
      handleNext()
    }, 3000);
    return () => clearInterval(interval);
  })
  const handlePrev = () => {
    if (scrollNeg || scrollPos) return;
    setScrollPos(true);
    const timeout = setTimeout(() => {
      let copy = imagesUrl.slice(0, imagesUrl.length - 1);
      copy.unshift(imagesUrl[imagesUrl.length - 1]);
      setImageUrl(copy);
      setScrollPos(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }
  const handleNext = () => {
    if (scrollNeg || scrollPos) return;
    setScrollNeg(true);
    const timeout = setTimeout(() => {
      setScrollNeg(false);
      let copy = imagesUrl.slice(1, imagesUrl.length);
      copy.push(imagesUrl[0]);
      setImageUrl(copy);
    }, 1000);
    return () => clearTimeout(timeout);
  }
  return (
    <div className='w-full overflow-hidden p-2 my-5 md:my-0 md:p-1 bg-gray-100'>
      {/* <div className='h-9 md:h-3'></div> */}
      <button className='hidden lg:block' onClick={handlePrev}>
        <MdNavigateBefore className='text-6xl bg-gray-200 rounded-full absolute left-6 top-64 p-3 z-10' />
      </button>
      <button className='hidden lg:block' onClick={handleNext}>
        <MdNavigateNext className='text-6xl bg-gray-200 rounded-full absolute right-6 top-64 p-3 z-10' />
      </button>
      <div className='overflow-x-hidden w-full h-auto'>
        <div className={`flex items-center text-center justify-center ${(scrollNeg || scrollPos) && "transition duration-1000"} ${scrollNeg && "-translate-x-full"} ${scrollPos && "translate-x-full"}`}>
          {imagesUrl.map((url, index) => {
            return <div key={uuid()} className='w-full min-w-full'>
              <Image src={url} alt="carousel" className='h-auto w-full mx-auto rounded-md md:pb-0' width={1240} height={400} />
            </div>
          })}
        </div>
      </div>
      {/* <div className='h-9 md:h-3'></div> */}
    </div>
  )
}

export default Carousel