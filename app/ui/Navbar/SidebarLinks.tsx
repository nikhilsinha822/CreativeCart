import { IoHomeOutline } from "react-icons/io5";
import { MdFormatListBulleted } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
import { GoArchive } from "react-icons/go";
import { CiGlobe } from "react-icons/ci";
import { MdOutlineHeadphones } from "react-icons/md";
import { IoDocumentOutline } from "react-icons/io5";
import Link from "next/link";

const SidebarLinks = () => {
    return (
        <>
            <div className="">
                <Link className="flex text-center items-center w-full p-5 hover:bg-blue-100" href="/">
                    <IoHomeOutline className="text-gray-500 mr-5 text-xl active:text-white" />
                    Home
                </Link>
                <Link className="flex text-center items-center w-full p-5 hover:bg-blue-100" href="#">
                    <MdFormatListBulleted className="text-gray-500 mr-5 text-xl active:text-white" />
                    Categories
                </Link>
                <Link className="flex text-center items-center w-full p-5 hover:bg-blue-100" href="#">
                    <FaRegHeart className="text-gray-500 mr-5 text-xl active:text-white" />
                    Favorites
                </Link>
                <Link className="flex text-center items-center w-full p-5 hover:bg-blue-100" href="/orders">
                    <GoArchive className="text-gray-500 mr-5 text-xl active:text-white" />
                    My Orders
                </Link>
            </div>
            <hr className="border w-11/12" />
            <div>
                <Link className="flex text-center items-center w-full p-5 hover:bg-blue-100" href="#">
                    <CiGlobe className="text-gray-500 mr-5 text-xl active:text-white" />
                    English | USD</Link>
                <Link className="flex text-center items-center w-full p-5 hover:bg-blue-100" href="#">
                    <MdOutlineHeadphones className="text-gray-500 mr-5 text-xl active:text-white" />
                    Contact Us</Link>
                <Link className="flex text-center items-center w-full p-5 hover:bg-blue-100" href="#">
                    <IoDocumentOutline className="text-gray-500 mr-5 text-xl active:text-white" />
                    About</Link>
            </div>
            <hr className="border w-11/12" />
            <div>
                <Link className="flex text-center items-center w-full p-5 hover:bg-blue-100" href="#">User agreement</Link>
                <Link className="flex text-center items-center w-full p-5 hover:bg-blue-100" href="#">Patnership</Link>
                <Link className="flex text-center items-center w-full p-5 hover:bg-blue-100" href="#">Privacy policy</Link>
            </div>
        </>
    )
}

export default SidebarLinks