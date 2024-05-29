import React, { useState, useEffect } from 'react'
import DialogBox from '@/app/ui/DialogBox'
import { userResponseType, shippingInfoType } from '@/app/lib/definations';
import Loading from '../Loading';
import { v4 as uuid } from 'uuid';

const AddressDialog = ({ token, setShipping }: { token: string, setShipping: React.Dispatch<React.SetStateAction<shippingInfoType | null>> }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [activeShipping, setActiveShipping] = useState<shippingInfoType | null>(null)
    const [shippingInfo, setShippingInfo] = useState<shippingInfoType[] | null>(null);

    useEffect(() => {
        const fetchAddress = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/profile/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    cache: 'no-cache'
                })
                const { user }: { user: userResponseType } = await response.json();
                setShippingInfo(user.shippingInfo);
            } catch (err: any) {
                console.error(err.message)
            } finally {
                setIsLoading(false);
            }
        }
        fetchAddress();
    }, [token])



    return (
        <div className="">
            <input
                type="button"
                className="text-blue-500 hover:text-blue-700 hover:cursor-pointer underline text-md py-1 rounded-md"
                onClick={() => setIsDialogOpen(true)}
                value="Choose Saved Address"
            />
            <DialogBox isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} title="Choose Address">
                {
                    isLoading || !shippingInfo ?
                        <Loading />
                        :
                        <div className='w-full'>
                            {
                                shippingInfo.length ?
                                    <form action="">
                                        {shippingInfo.map((val) => {
                                            const id = uuid();
                                            return <div key={id}>
                                                <div className='flex justify-between items-center gap-5'>
                                                    <input type="radio"
                                                        id={id}
                                                        checked={activeShipping === val}
                                                        onClick={() => setActiveShipping(val)}
                                                    />
                                                    <label htmlFor={id} className='hover:cursor-pointer'>
                                                        {val.address}, {val.city}, {val.state}, {val.country}, {val.pinCode}, {val.phoneNo}
                                                    </label>
                                                </div>
                                                <hr className='border-gray-500 m-5' />
                                            </div>
                                        })}
                                    </form>
                                    :
                                    <p className='text-center'>No Address Found</p>
                            }
                            <input
                                type="button"
                                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 hover:cursor-pointer text-white rounded-md"
                                onClick={() => {
                                    setShipping(activeShipping)
                                    setIsDialogOpen(false)
                                }}
                                value='Add Address'
                            />

                        </div>
                }
            </DialogBox>
        </div>
    )
}

export default AddressDialog