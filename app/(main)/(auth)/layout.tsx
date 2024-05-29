import React from 'react'
import { Suspense } from 'react'
import Loading from '@/app/ui/Loading'

interface AuthLayoutProps {
    children?: React.ReactNode
}

const HomeLayout = ({ children }: AuthLayoutProps) => {
    return (
        <div>
            <Suspense fallback={<Loading />}>
                {children}
            </Suspense>
        </div>
    )
}

export default HomeLayout