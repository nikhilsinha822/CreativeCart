import { useContext } from 'react';
import { AuthContext } from '@/app/context/authContext';
import { userResponseType } from '@/app/lib/definations';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { FaBoxesPacking } from "react-icons/fa6";
import { RiLogoutBoxLine } from "react-icons/ri";
import { IoSettingsSharp } from "react-icons/io5";

const Sidebar = ({ user }: { user: userResponseType }) => {
    const { logoutState } = useContext(AuthContext);
    const router = useRouter();
    const handleLogOut = async () => {
        await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/logout`, {}, {
            withCredentials: true
        });
        logoutState();
        router.push('/');
    }
    const capitalizeFirstLetter = (string: string) => {
        return string.replace(/\w\S*/g, (txt) => {
            return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase();
        });
    }
    return <div className='h-screen sticky top-0 text-base'>
        <div className='flex items-center p-3 m-5 bg-white'>
            <Image src={user.avatar.url}
                className='rounded-full w-14 h-14'
                width={250} height={250} alt={user.name} />
            <h6 className='font-bold px-2 truncate'>Hello, {capitalizeFirstLetter(user.name)}</h6>
        </div>
        <div className='bg-white m-5'>
            <div className='p-3 border flex items-center'>
                <FaBoxesPacking className='mx-2' />
                <Link href={'/orders'}>My Orders</Link>
            </div>
            <div className='border flex flex-col'>
                <h1 className='p-3 flex items-center'><IoSettingsSharp className='mx-2' />Account Setting</h1>
                <Link className='p-3 pl-12' href={'/profile?link=personal'}>Profile</Link>
                <Link className='p-3 pl-12' href={'/profile?link=address'}>Address</Link>
            </div>
            <button onClick={handleLogOut} className='p-3 border flex items-center w-full'><RiLogoutBoxLine className='mx-2' />Logout</button>
        </div>
    </div>
}

export default Sidebar;