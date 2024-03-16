'use client'
import Link from "next/link"
import Logo from "../../public/logo(2).png"
import { FaFacebook } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { IoLogoGooglePlaystore } from "react-icons/io5";
import { BsApple } from "react-icons/bs";
import Image from "next/image";

const Footer = () => {
  const date = new Date().getFullYear();
  return (
    <footer className="w-full overflow-hidden">
      <div className="flex flex-wrap px-9 pt-5 w-full gap-2 justify-center">
        <div className="md:max-w-md">
          <div>
            <Image src={Logo} width={150} height={80} alt="Invently" />
          </div>
          <div>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Debitis, tempore!</div>
          <div className="flex justify-between items-center w-2/3 text-gray-500 text-3xl">
            <button className="hover:text-black"><FaFacebook /></button>
            <button className="hover:text-black"><FaSquareXTwitter /></button>
            <button className="hover:text-black"><FaInstagramSquare /></button>
            <button className="hover:text-black"><FaLinkedin /></button>
            <button className="hover:text-black"><FaYoutube /></button>
          </div>
        </div>
        <div className="p-5 flex flex-col text-gray-500">
          <div className="font-bold text-black">About</div>
          <Link href="#">About Us</Link>
          <Link href="#">Find Store</Link>
          <Link href="#">Categories</Link>
          <Link href="#">Blogs</Link>
        </div>
        <div className="p-5 flex flex-col text-gray-500">
          <div className="font-bold text-black">Partnership</div>
          <Link href="#">About Us</Link>
          <Link href="#">Find Store</Link>
          <Link href="#">Categories</Link>
          <Link href="#">Blogs</Link>
        </div>
        <div className="p-5 flex flex-col text-gray-500">
          <div className="font-bold text-black">Information</div>
          <Link href="#">Help Center</Link>
          <Link href="#">Money Refund</Link>
          <Link href="#">Shipping</Link>
          <Link href="#">Contact Us</Link>
        </div>
        <div className="p-5 flex flex-col text-gray-500">
          <div className="font-bold text-black">For Users</div>
          <Link href="#">Login</Link>
          <Link href="#">Register</Link>
          <Link href="#">Settings</Link>
          <Link href="#">My Orders</Link>
        </div>
        <div className="p-5 flex flex-col gap-2">
          <div className="font-bold">Get app</div>
          <button className="bg-black text-white rounded-lg flex items-center text-left px-2 py-2">
            <IoLogoGooglePlaystore className="text-3xl mx-1" />
            <div>
              <div className="text-2xs">Get it on</div>
              <div className="text-sm">Google Play</div>
            </div>
          </button>
          <button className="bg-black text-white rounded-lg flex items-start text-left px-2 py-2">
            <BsApple className="text-3xl mx-1" />
            {/* <IoLogoGooglePlaystore className="text-3xl" /> */}
            <div>
              <div className="text-2xs">Download on the</div>
              <div className="text-sm">App Store</div>
            </div>
          </button>
        </div>
      </div>
      <div className="bg-blue-900 text-white w-full px-10 py-1">
        <div>© {date} Invently</div>
      </div>
    </footer>
  )
}

export default Footer