'use client'
import React from 'react'
import Button from '@/app/ui/Button'

const BottomButtons = () => {
  return (
    <div className='flex gap-2'>
        <Button>Add to Cart</Button>
        <Button>Buy</Button>
    </div>
  )
}

export default BottomButtons