'use client'
import Link from "next/link"
import { useState, Suspense } from "react";
import { GoHeartFill } from "react-icons/go";
import { FaShoppingCart } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";
import Image from "next/image";
import profile from "../../public/profile.jpg";
import Logo from "../../public/logo(2).png";
import SidebarLinks from "./Navbar/SidebarLinks";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {v4 as uuid} from 'uuid';

type SearchParams = {
  category: { id: number, name: string }[]
}

const Navbar = () => {
  const [sidebar, setSidebar] = useState<Boolean>(false);
  const pathname = usePathname();
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
      <div className={`fixed h-full w-full transition duration-300 ${sidebar ? "" : "-translate-x-full"} z-50`} onClick={() => setSidebar((prev) => !prev)}>
        <div className="bg-white h-full w-10/12">
          <div className="bg-gray-200 p-6 pl-5">
            <Image src={profile} width={50} height={50} alt="profile" className="rounded-full h-auto w-auto" />
            <br />
            <Link href={`/login?redirectTo=${pathname}`}>Sign In</Link>
            &nbsp;|&nbsp;
            <Link href={`/register?redirectTo=${pathname}`}>Register</Link>
          </div>
          <SidebarLinks />
        </div>
      </div>

      {/* {Navbar} */}
      <div className="flex justify-between item-center text-center pt-2 pb-2 border-gray-200 sm:border-b-2">
        <div className="flex items-center pl-5">
          <span onClick={() => setSidebar((prev) => !prev)}>
            <GiHamburgerMenu className="text-2xl mr-3 text-gray-500 sm:hidden" />
          </span>
          <Image src={Logo} height={35} width={160} alt="invently" className="h-4/5 md:h-auto w-auto" />
        </div>

        <Suspense>
          <SearchBar
            category={category}
          /> 
        </Suspense>

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

      <Suspense>
        <MobileSearchBar/>
      </Suspense>
    </nav>
  )
}

const SearchBar = ({ category }: SearchParams) => {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState<string>(searchParams.get("q") || "");
  const { replace } = useRouter();

  const handleSearch = (e: any) => {
    e.preventDefault();
    if (query === "") return;
    replace(`/search?q=${query}`);
  }

  return <form onSubmit={handleSearch} className="w-3/5 pt-2 pb-2 items-center hidden sm:flex">
    <input
      className="rounded-l-md border-blue-600 border-2 border-r p-2 h-full w-full outline-none"
      onChange={(e) => setQuery(e.target.value)} value={query} type="text" placeholder="Search" />
    <select name="" id="" className="border-blue-600 border-2 border-r-0 border-l-0 h-full w-1/3 outline-none" defaultValue="NULL">
      <option className="hidden" value={"NULL"}>All Category</option>
      {category.map((val) => <option key={uuid()} value={val.id}>{val.name}</option>)}
    </select>
    <button className="bg-blue-600 text-white p-1 w-1/4 rounded-r-md h-full">Search</button>
  </form>
}

const MobileSearchBar = () => {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState<string>(searchParams.get("q") || "");
  const { replace } = useRouter();

  const handleSearch = (e: any) => {
    e.preventDefault();
    if (query === "") return;
    replace(`/search?q=${query}`);
  }

  return <form onSubmit={handleSearch} className="flex justify-center sm:hidden">
    <input
      onChange={(e) => setQuery(e.target.value)}
      value={query}
      type="text" className="bg-transparent p-2 pl-9 border-2 shadow-sm w-11/12 rounded-md" placeholder="Search" />
    <span className="bg-blue-50 p-2 border-2 shadow-sm w-11/12 rounded-md absolute -z-10 ">
      <IoSearch className="text-2xl text-gray-400" />
    </span>
  </form>
}

export default Navbar