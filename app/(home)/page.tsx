import Carousel from '../ui/Home/Carousel'
import DealsAndOffer from '../ui/Home/DealsAndOffer'
import CardWrapper from '../ui/Home/Cards'
import { HomeCardsSkeleton } from '../ui/Skeletons'
import { Suspense } from 'react'

const Home = () => {
  return (
    <div className='md:bg-blue-50'>
      <Carousel />
      <DealsAndOffer />
      <div className='md:p-10'>
        <h1 className='text-2xl font-bold p-5 bg-white'>Recommended items</h1>
        <Suspense fallback={<HomeCardsSkeleton/>}>
          <CardWrapper /> 
        </Suspense>
      </div>
    </div>
  )
}

export default Home