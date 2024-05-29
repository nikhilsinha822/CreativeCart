import React from 'react'
import Navbar from '@/app/ui/Navbar'
import Footer from '@/app/ui/Footer'
import { Suspense } from 'react'
import Loading from '@/app/ui/Loading'

interface HomeLayoutProps {
  children?: React.ReactNode
}
export const revalidate = 3600

const HomeLayout = ({ children }: HomeLayoutProps) => {
  return (
    <div>
      <Navbar />
      <Suspense fallback={<Loading />}>
        {children}
      </Suspense>
      <Footer />
    </div>
  )
}

export default HomeLayout