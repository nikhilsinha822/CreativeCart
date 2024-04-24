import {v4 as uuid} from 'uuid'

const shimmer =
    'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

export const HomeCardSkeleton = () => {
    return <div className={`${shimmer} bg-white relative p-3 rounded-sm border shadow-sm`}>
        <div className='bg-gray-200 h-56 w-full' />
        <div className='bg-gray-200 my-3 h-4 w-1/3'></div>
        <div className='bg-gray-200 w-full my-3 h-4'></div>
    </div>
}

export const HomeCardsSkeleton = () => {
    return <div className='grid grid-cols-2 md:gap-5 md:grid-cols-4 xl:grid-cols-5 gap-1'>
        {
            [...Array(10)].map((val, ind) => {
                return <HomeCardSkeleton key={uuid()}/>
            })
        }
    </div>
}
