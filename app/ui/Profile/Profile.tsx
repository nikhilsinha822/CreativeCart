import { userResponseType } from "@/app/lib/definations";
import { useState, useEffect } from "react";
import { useFormState } from "react-dom";
import { handleProfile } from "@/app/lib/action";
import axios from "axios";
import toast from "react-hot-toast";
import Image from "next/image";
import { FaPencilAlt } from 'react-icons/fa';
import Button from "../Button";

const Profile = ({ user, token }: { user: userResponseType, token: string }) => {
    const initialState = { message: "", accessToken: token, user: user }
    const [avatar, setAvatar] = useState(user.avatar.url);
    const [userState, setUserState] = useState(user);
    const [response, profileAction] = useFormState(handleProfile, initialState)

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        setAvatar(URL.createObjectURL(e.target.files[0]));
    };

    const handlePasswordReset = async () => {
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/forgotpassword`, {
                email: userState.email
            })
            toast.success('Password reset link sent to your email')
        } catch (err: any) {
            console.log(err.response.data)
            toast.error('An error occured while resetting password')
        }
    }

    useEffect(() => {
        if (response.message === "Success") {
            setUserState(user);
            toast.success("Profile has been updated successfully")
        } else if (response.message !== "") {
            toast.error(response.message);
        }
    }, [response, user]);

    return <div className='m-5 ml-0 bg-white w-full text-base'>
        <form action={profileAction}>
            <div className='flex flex-col md:flex-row justify-between m-14 mr-0 mb-0'>

                <div className='flex flex-col order-2 md:order-1'>
                    <label className='font-bold my-5' htmlFor="name">Full Name</label>
                    <input className='border p-4 py-2' name="name" type="text" defaultValue={userState.name} />
                    <label className='font-bold my-5' htmlFor="email">Email Address</label>
                    <input className='border p-4 py-2' name="email" type="text" defaultValue={userState.email} />
                </div>

                <div className='flex flex-col justify-center items-center my-1 order-1 md:order-2'>
                    <Image className='rounded-full aspect-square w-28 md:w-3/4' src={avatar} width={200} height={200} alt={user.name} />
                    <label htmlFor='avatar' className='flex justify-center items-center w-auto border-2 px-4 py-2 my-2 focus:ring-1 focus:ring-black hover:cursor-pointer hover:text-blue-400'>
                        Edit Profile &nbsp;&nbsp;
                        <FaPencilAlt />
                    </label>
                    <input
                        type='file'
                        id="avatar"
                        name="avatar"
                        accept='image/*'
                        className='hidden'
                        onChange={handleAvatarChange}
                    />
                </div>

            </div>

            <div className='flex justify-between items-center'>
                <div className='m-auto md:m-14'>
                    <button type='button' className='border border-black p-2 px-5 text-base mt-8'
                        onClick={handlePasswordReset}>Reset Password</button>
                </div>
                <div className='m-auto md:m-6'>
                    <Button>Update Profile</Button>
                </div>
            </div>
        </form>
    </div>
}

export default Profile