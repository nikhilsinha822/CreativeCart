"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import { Images } from '../../lib/definations'

const ImageSection = ({ image }: { image: Images[] }) => {
  const [currImage, setCurrImage] = useState(image[0]);
  if (!image) return (<div>Image not found</div>);
  return (
    <div className='flex'>
      <div className='flex flex-col justify-evenly mr-2 md:mx-3 md:ml-5 md:my-10'>
        {image.map((img, index) => (
          <div key={index} className={`product-image w-16  md:w-20 h-auto hover:cursor-pointer hover:opacity-80 ${currImage === img && "border-2 border-blue-500 opacity-65 hover:opacity-65"}`}>
            <Image
              onClick={() => setCurrImage(img)}
              className='h-auto'
              src={img.url} alt={`img${index}`} width={400} height={400}
              />
          </div>
        ))}
      </div>
      <div className='flex items-center justify-center'>
        <Image
        className='w-screen h-auto'
        width={400} height={400} src={currImage.url} alt="product" priority />
      </div>
    </div>
  )
}

export default ImageSection