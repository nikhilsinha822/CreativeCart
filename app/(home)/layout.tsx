import React from 'react'
import Navbar from '../ui/Navbar'
import Footer from '../ui/Footer'
import { Suspense } from 'react'

interface HomeLayoutProps {
  children?: React.ReactNode
}
export const revalidate = 3600

const HomeLayout = ({ children }: HomeLayoutProps) => {
  return (
    <div>
      <Suspense>

        <Navbar />
        {children}
        <Footer />
      </Suspense>
    </div>
  )
}

export default HomeLayout