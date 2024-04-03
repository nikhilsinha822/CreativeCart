import React from 'react'
import { FaStar } from "react-icons/fa";
import { productType } from '../lib/definations';

const Rating = ({ product }: { product: productType }) => {
    const rating = Math.ceil(product.rating.stars / product.rating.numReviews);
    return (
        <>
            <div className='flex items-center'>
                {
                    [...Array(5)].map((key, index) => {
                        return <FaStar
                            key={index}
                            className={`${index + 1 > rating ? "text-gray-400" : "text-yellow-400"}`}
                        />
                    })
                }
                <span className='font-semibold text-yellow-400 mx-1 text-sm'>{`${rating}`}</span>
                <span className='text-gray-400 text-xs'>{`(${product.rating.numReviews})`}</span>
            </div>
        </>
    )
}

export default Rating