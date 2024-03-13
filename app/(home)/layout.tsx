import React from 'react'
import Navbar from '../ui/Navbar'
import Footer from '../ui/Footer'

interface HomeLayoutProps {
    children?: React.ReactNode
}

const HomeLayout = ({children} : HomeLayoutProps) => {
  return (
    <div>
        <Navbar />
        {children}
        <Footer />
    </div>
  )
}

export default HomeLayout