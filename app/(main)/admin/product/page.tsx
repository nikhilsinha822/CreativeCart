'use client'
import React, { Suspense, useContext, useState, useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { AuthContext } from '@/app/context/authContext'
import NotLoggedIn from '@/app/ui/NotLoggedIn'
import Loading from '@/app/ui/Loading'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { productResponseType, productType } from '@/app/lib/definations'
import Link from 'next/link'
import { FaSearch } from "react-icons/fa";
import Pagination from '@/app/ui/Pagination'
import { useDebouncedCallback } from 'use-debounce'
import toast from 'react-hot-toast'
import { revalidateTag } from 'next/cache'

const AdminProduct = () => {
    let content;
    const router = useRouter();
    const { token, roles, isAuthenticated } = useContext(AuthContext);

    if (!isAuthenticated || token === null || token === ' ') {
        if (isAuthenticated !== null && token !== ' ') {
            content = <NotLoggedIn />
        }
        else {
            content = <Loading />
        }
    }

    else if (roles && !roles.includes('Admin'))
        router.push('/')

    else {
        content = <div className="container mx-auto p-4">
            <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Admin Product Management</h1>
            <div className='flex justify-end'>
                <AdminSearchBar />
            </div>
            <Suspense fallback={<Loading />}>
                <AdminProductList token={token} />
            </Suspense>
        </div>
    }
    return content;
}

const AdminSearchBar = () => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter()
    const page = searchParams.get('page') || 1;
    const query = searchParams.get('q') || '';
    const [search, setSearch] = useState(query);

    const handleSearch = useDebouncedCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', '1');
        if (e.target.value) {
            params.set('q', e.target.value);
        } else {
            params.delete('q');
        }
        router.replace(`${pathname}?${params.toString()}`)
    }, 300);

    return (
        <div className="relative w-full md:w-1/3 my-5">
            <input
                type="text"
                onChange={handleSearch}
                placeholder="Search Admin Panel"
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
                defaultValue={searchParams.get('q')?.toString()}
            />
            <div
                className="absolute inset-y-0 right-0 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-300"
            >
                <FaSearch className="w-full h-5 text-gray-500" />
            </div>
        </div>
    )
}

const AdminProductList = ({ token }: { token: string }) => {
    const searchParams = useSearchParams();
    const page = searchParams.get('page') || 1;
    const query = searchParams.get('q') || '';
    const [isLoading, setIsLoading] = useState(true);
    const [products, setProducts] = useState<productResponseType | null>(null);
    const router = useRouter();

    useEffect(() => {
        (async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/product?search=${query}&page=${page}&pageSize=20`)
                const products: productResponseType = response.data;
                setProducts(products);
            } catch (err: any) {
                console.log(err);
            } finally {
                setIsLoading(false);
            }
        })()
    }, [query, page])


    const handleDelete = async (id: string) => {
        if (!products)
            return;

        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/admin/product/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const updateProduct = products?.data.filter((product) => product._id !== id)
            const productUpdateResponse = {
                ...products,
                data: updateProduct
            }
            setProducts(productUpdateResponse)
            // revalidateTag(`products ${id}`)
            toast.success("Successfully Deleted")
        } catch (err: any) {
            console.log(err)
            toast.error("There was some problem deleting that product")
        }
    };

    const handleEdit = (id: string) => {
        router.push(`/admin/product/edit/${id}`);
    }

    if (isLoading || products === null)
        return <Loading />

    if (products.data.length === 0)
        return <div className='w-full min-h-screen flex items-center justify-center text-center text-2xl'>
            <div className='h-1/2'>
                No Products found
            </div>
        </div>
    return (
        <>
            <div className="overflow-x-auto rounded-lg shadow-md bg-white">
                <table className="min-w-full text-left">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="py-4 px-6 font-semibold text-gray-800">Product ID</th>
                            <th className="py-4 px-6 font-semibold text-gray-800">Name</th>
                            <th className="py-4 px-6 font-semibold text-gray-800">Price(INR)</th>
                            <th className="py-4 px-6 font-semibold text-gray-800">Stock</th>
                            <th className="py-4 px-6 font-semibold text-gray-800">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            products.data.map((product) => (
                                <tr key={product._id} className="hover:bg-gray-100 transition-colors duration-300">
                                    <td className="py-4 px-6 border-b border-gray-200">
                                        <Link
                                            href={`/${product._id}`}
                                            className="text-indigo-600 hover:text-indigo-800 underline"
                                        >
                                            {product._id}
                                        </Link>
                                    </td>
                                    <td className="py-4 px-6 border-b border-gray-200">{product.title}</td>
                                    <td className="py-4 px-6 border-b border-gray-200">₹{product.price}</td>
                                    <td className="py-4 px-6 border-b border-gray-200">{product.stock}</td>
                                    <td className="py-4 px-6 border-b border-gray-200 flex justify-center space-x-2">
                                        <button
                                            onClick={() => handleEdit(product._id)}
                                            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-300"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product._id)}
                                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:red-500 transition-colors duration-300"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
            <Pagination totalPages={products.matchedPages - 1} />
        </>
    );
};

export default AdminProduct