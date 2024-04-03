'use client'
import React from 'react'
import Link from 'next/link';
import { useSearchParams, usePathname } from 'next/navigation'
import { Suspense } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const Pagination = ({ totalPages }: { totalPages: number }) => {
    return <Suspense>
        <PaginationComponent totalPages={totalPages} />
    </Suspense>
}

const PaginationComponent = ({ totalPages }: { totalPages: number }) => {
    const currentPage = useSearchParams().get('page') || 1;
    const searchParams = new URLSearchParams(useSearchParams());
    const pathname = usePathname();
    const createPageURL = (page: number) => {
        page = Math.max(1, Math.min(totalPages + 1, page));
        searchParams.set('page', page.toString());
        return `${pathname}?${searchParams.toString()}`;
    }
    return (
        <div className='flex items-center justify-center my-10 transition-transform'>
            {
                totalPages > 5 && <>
                    <Link
                        href={createPageURL(Number(currentPage) - 1)}
                        className='p-2 hover:border-r-white bg-white text-blue-500 flex items-center rounded-l-md w-30 border-white border-2 hover:border-blue-500 hover:text-white hover:bg-blue-500'>
                        <IoIosArrowBack />
                        Previous
                    </Link>
                </>
            }
            <div className='flex'>
                {
                    Number(currentPage) - 1 > 1 && <>
                        <Link
                            href={createPageURL(1)}
                            className='p-2 bg-white text-blue-500 transition-transform border-white border-2 hover:border-blue-500 hover:bg-blue-500 hover:text-white '>
                            {1}
                        </Link>
                        <div
                            className='flex items-center justify-center p-2 bg-white text-blue-500'>
                            ...
                        </div>
                    </>
                }
                {
                    Array.from({ length: totalPages }, (v, i) => i + 1)
                        .filter((page) => page > Number(currentPage) - 2 && page < Number(currentPage) + 2)
                        .map((page) => (
                            <>
                                <Link
                                    key={page}
                                    href={createPageURL(page)}
                                    className={`p-2 hover:bg-blue-500 hover:text-white bg-white text-blue-500 ${currentPage == page ?
                                        'border-2 border-blue-500' :
                                        'border-2 border-white hover:border-blue-500'}`}>
                                    {page}
                                </Link>
                            </>
                        ))
                }
                {
                    Number(currentPage) + 1 < totalPages && <>
                        <div className='flex items-center justify-center p-2 bg-white text-blue-500'>...</div>
                        <Link
                            href={createPageURL(totalPages)}
                            className='p-2 bg-white text-blue-500 border-white border-2 hover:border-blue-500 hover:bg-blue-500 hover:text-white'>
                            {totalPages}
                        </Link>
                    </>
                }
            </div>
            {
                totalPages > 5 &&
                <>

                    <Link
                        href={createPageURL(Number(currentPage) + 1)}
                        className='p-2 hover:border-l-white bg-white text-blue-500 flex items-center text-center w-30 rounded-r-md border-white border-2 hover:border-blue-500 hover:text-white hover:bg-blue-500'>
                        Next
                        <IoIosArrowForward />
                    </Link>
                </>
            }
        </div>
    )
}

export default Pagination