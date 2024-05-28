'use client'
import React from 'react'
import Navbar from '@/app/ui/Navbar'
import Footer from '@/app/ui/Footer'

interface AdminLayoutProps {
  children?: React.ReactNode
}
export const revalidate = 3600

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  )
}

export default AdminLayout