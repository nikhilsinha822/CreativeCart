import React from 'react'
import { Suspense } from 'react'
import ProductList from '@/app/ui/Search/ProductsList'
import Loading from '@/app/ui/Loading'

type SearchProps = {
  params: { slug: string }
  searchParams: { 
    q: string,
    page: number
  }
}

const Search = ({ params, searchParams }: SearchProps) => {
  const query = searchParams.q || '';
  const page = searchParams.page || 1;
  return (
    <div className='bg-blue-50'>
      <Suspense fallback={<Loading/>}>
        <ProductList query={query} page={page} />
      </Suspense>
    </div>
  )
}



export default Search