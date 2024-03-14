'use client'
import Link from "next/link"
import { useState } from "react";
import { GoHeartFill } from "react-icons/go";
import { FaShoppingCart } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";
import Image from "next/image";
import profile from "../../public/profile.jpg";
import Logo from "../../public/logo invently.png";
import SidebarLinks from "./Navbar/SidebarLinks";

const Navbar = () => {
  const [sidebar, setSidebar] = useState(false);
  const category = [
    {
      id: 1,
      name: "Electronics"
    },
    {
      id: 2,
      name: "Fashion"
    },
    {
      id: 3,
      name: "Home"
    },
    {
      id: 4,
      name: "Beauty"
    },
    {
      id: 5,
      name: "Toys"
    },
    {
      id: 6,
      name: "Grocery"
    },
    {
      id: 7,
      name: "Sports"
    },
    {
      id: 8,
      name: "Automotive"
    },
    {
      id: 9,
      name: "Books"
    },
    {
      id: 10,
      name: "Health"
    },
    {
      id: 11,
      name: "Music"
    },
    {
      id: 12,
      name: "Movies"
    },
    {
      id: 13,
      name: "Games"
    },
    {
      id: 14,
      name: "Garden"
    },
    {
      id: 15,
      name: "Pet"
    },
    {
      id: 16,
      name: "Tools"
    },
    {
      id: 17,
      name: "Baby"
    },
    {
      id: 18,
      name: "Software"
    }
  ];
  return (
    <nav>
      {/* {Sidebar} */}
      <div className={`absolute h-full w-full transition duration-300 ${sidebar ? "" : "-translate-x-full"}`} onClick={()=>setSidebar((prev)=>!prev)}>
        <div className="bg-white h-full w-10/12">
          <div className="bg-gray-200 p-6 pl-5">
            <Image src={profile} width={50} height={50} alt="profile" className="rounded-full" />
            <br />
            <Link href="#">Sign In</Link>
            &nbsp;|&nbsp;
            <Link href="#">Register</Link>
          </div>
          <SidebarLinks />
        </div>
      </div>

      {/* {Navbar} */}
      <div className="flex justify-between item-center text-center pt-4 pb-4 border-gray-200 sm:border-b-2">
        <div className="flex items-center pl-5">
          <span onClick={() => setSidebar((prev) => !prev)}>
            <GiHamburgerMenu className="text-2xl mr-3 text-gray-500 sm:hidden" />
          </span>
          <Image src={Logo} height={35} width={160} alt="invently"/>
        </div>
        <div className="w-3/5 items-center hidden sm:flex">
          <input className="rounded-l-md border-blue-600 border-2 border-r p-2 h-full w-full outline-none" type="text" placeholder="Search" />
          <select name="" id="" className="border-blue-600 border-2 border-r-0 border-l-0 h-full w-1/3" defaultValue="NULL">
            <option className="hidden" value={"NULL"}>All Category</option>
            {category.map((val) => <option key={val.id} value={val.id}>{val.name}</option>)}
          </select>
          <button className="bg-blue-600 text-white p-1 w-1/4 rounded-r-md h-full">Search</button>
        </div>
        <div className="hidden items-center text-xs text-center space-x-5 pr-8 text-gray-500 sm:flex">
          <Link href={'/profile'} className="text-center">
            <FaUser className="text-xl m-auto pb-1" />
            Profile
          </Link>
          <Link href={'/orders'}>
            <GoHeartFill className="text-xl m-auto pb-1" />
            Orders
          </Link>
          <Link href={'/cart'}>
            <FaShoppingCart className="text-xl m-auto pb-1" />
            My Cart
          </Link>
        </div>
        <div className="flex items-center text-xs text-center space-x-5 pr-8 text-gray-500 sm:hidden">
          <Link href={'/cart'}>
            <FaShoppingCart className="text-xl m-auto" />
          </Link>
          <Link href={'/profile'} className="text-center">
            <FaUser className="text-xl m-auto" />
          </Link>
        </div>
      </div>

      {/* {Mobile SeacrchBar} */}
      <div className="flex justify-center sm:hidden">
        <input type="text" className="bg-transparent p-2 pl-9 border-2 shadow-sm w-11/12 rounded-md" placeholder="Search" />
        <span className="bg-blue-50 p-2 border-2 shadow-sm w-11/12 rounded-md absolute -z-10 ">
          <IoSearch className="text-2xl text-gray-400" />
        </span>
      </div>
    </nav>
  )
}

export default Navbar