import { userResponseType } from "@/app/lib/definations";
import { useState, useEffect } from "react";
import { useFormState } from "react-dom";
import { addNewAddress, deleteAddress } from "@/app/lib/action";
import Button from "../Button";
import toast from "react-hot-toast";
import { BsExclamationCircle } from 'react-icons/bs';
import { CiMenuKebab } from "react-icons/ci";
import { v4 as uuid } from 'uuid'
import { shippingInfoType } from "@/app/lib/definations";
import { FaPlus } from "react-icons/fa";

const Address = ({ user, token }: { user: userResponseType, token: string }) => {
    const initialState = { message: "", accessToken: token, user }
    const [addressToggle, setAddressToggle] = useState(false)
    const [address, setAddress] = useState(user.shippingInfo);
    const [userState, setUserState] = useState(user)
    const [newAddressResponse, newAddressAction] = useFormState(addNewAddress, initialState);

    const handleDelete = async (index: number) => {
        const response = await deleteAddress(index, address, token)
        if (response.message === "Success" && response.shippingInfo) {
            setAddress(response.shippingInfo)
            setUserState({
                ...userState,
                shippingInfo: response.shippingInfo
            })
            newAddressResponse.user = {
                ...userState,
                shippingInfo: response.shippingInfo
            }
            toast.success("Address has been deleted successfully")
        } else {
            toast.error(response.message);
        }
    }

    useEffect(() => {
        if (newAddressResponse.message === "Success") {
            newAddressResponse.message = "";
            setAddressToggle(false);
            setAddress(newAddressResponse.user.shippingInfo);
            toast.success("New Address is added successfully")
        }
        else if (newAddressResponse.message !== "") {
            toast.error(newAddressResponse.message);
        }
    }, [newAddressResponse, user]);

    return <div className='m-5 ml-0 p-5 bg-white w-full text-base'>
        <h1 className='font-medium text-2xl m-2'>Manage Address</h1>
        {
            addressToggle ?
                <form action={newAddressAction} className='border p-5 bg-gray-100'>
                    <div className='flex flex-wrap'>
                        <input type="text" className="border m-2 p-4 py-2" name="address" placeholder="Address"></input>
                        <input type="text" className="border m-2 p-4 py-2" name="city" placeholder="City"></input>
                        <input type="text" className="border m-2 p-4 py-2" name="state" placeholder="State"></input>
                        <input type="text" className="border m-2 p-4 py-2" name="country" placeholder="Country"></input>
                        <input type="text" className="border m-2 p-4 py-2" name="pinCode" placeholder="Pin Code"></input>
                        <input type="text" className="border m-2 p-4 py-2" name="phoneNo" placeholder="Phone Number"></input>
                    </div>
                    {
                        newAddressResponse.message !== "" &&
                        <div className='flex items-center mx-2'>
                            <BsExclamationCircle className="text-red-500 mr-1" />
                            <p className="text-sm text-red-500">{newAddressResponse.message}</p>
                        </div>
                    }
                    <div className='mx-2 max-w-80 flex items-center justify-center'>
                        <Button>Add Address</Button>
                        <button type="button" onClick={() => setAddressToggle(false)}
                            className='text-blue-600 w-full font-medium p-3 rounded mt-8'>Cancel</button>
                    </div>
                </form>
                :
                <div className='mx-4'>
                    <button
                        className='flex items-center justify-center gap-1 font-bold border-2 border-dashed p-2 px-5 text-base w-full my-5 rounded-sm text-blue-500'
                        type="button" onClick={() => setAddressToggle(true)}><FaPlus/> Add New Address</button>
                </div>
        }
        <div className=''>
            {
                address.toReversed().map((shippingInfo, ind) => <div className='' key={uuid()}>
                    <AddressContainer
                        user={user} shippingInfo={shippingInfo}
                        handleDelete={handleDelete} index={ind}
                    />
                </div>)
            }
        </div>
    </div>
}

const AddressContainer = ({ user, shippingInfo, index, handleDelete }:
    {
        user: userResponseType, shippingInfo: shippingInfoType,
        index: number, handleDelete: (index: number) => Promise<void>
    }) => {
    const [menuToggle, setMenuToggle] = useState(false);

    const capitalizeFirstLetter = (string: string) => {
        return string.replace(/\w\S*/g, (txt) => {
            return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase();
        });
    }

    return <>
        <div className='m-4 border border-gray-300 rounded-sm p-4 py-8 flex relative'>
            <div>
                <p className='font-bold'>
                    {capitalizeFirstLetter(user.name)} &nbsp; {shippingInfo.phoneNo}
                </p>
                <p className='md:w-2/3'>
                    {shippingInfo.address}, {shippingInfo.city}, {shippingInfo.state}, {shippingInfo.country}, {shippingInfo.pinCode}
                </p>
            </div>
            {!menuToggle ?
                <CiMenuKebab className='absolute right-5' onMouseOver={() => setMenuToggle(true)} onMouseOut={() => setMenuToggle(false)} /> :
                <div className='absolute right-5 flex flex-col shadow-md bg-white border'
                    onMouseOver={() => setMenuToggle(true)} onMouseOut={() => setMenuToggle(false)}>
                    <input
                        onClick={() => handleDelete(index)}
                        name="delete" value="Delete" type='button' className='px-4 py-2 hover:text-red-600 hover:cursor-pointer' />
                </div>
            }
        </div>
    </>
}

export default Address