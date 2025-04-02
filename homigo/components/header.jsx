"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function Header() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const pathname = usePathname(); // Get current route

  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative bg-white p-9 border-b-2 border-gray-300">
      <header>
        <div className="absolute top-2 left-5 flex items-center">
          <Image
            src="/Images/TempLogo.png"
            alt="Homigo Logo"
            width={50}
            height={50}
          />
          <Link
            href="/userpage"
            className="text-black text-xl font-semibold ml-2"
          >
            HOMIGO
          </Link>
        </div>

        {/* Browse All Properties Button (conditionally hidden) */}
        {pathname !== "/listings" && (
          <Link href="/listings">
            <button className="absolute top-4 right-[150px] px-8 py-2 bg-black text-white rounded hover:bg-gray-600 transition">
              Browse
            </button>
          </Link>
        )}

        {/* Dropdown Menu */}
        <div className="absolute top-4 right-5 flex items-center">
          <div className="relative" ref={menuRef}>
            {menuOpen && (
              <div className="absolute right-0 mt-6 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <Link
                  href="/userpage"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </Link>
                <Link
                  href="/settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Settings
                </Link>
                <Link
                  href="/mylistings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  My Listings
                </Link>
                <Link
                  href="/about"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  About
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Log Out
                </button>
              </div>
            )}

            <div className="flex h-9 bg-white shadow-md rounded-full overflow-hidden">
              {/* Menu Button */}
              <div
                className="flex items-center justify-center px-3 cursor-pointer"
                onClick={toggleMenu}
              >
                <span className="text-lg">&#9776;</span>
              </div>

              {/* Profile Image */}
              <div className="w-9 flex items-center justify-center">
                <Image
                  src={session?.user?.image || "/Images/defaultUser.png"}
                  alt="User"
                  width={25}
                  height={25}
                  className="rounded-full mx-auto object-cover border-1 border-gray-300"
                  style={{ width: '25px', height: '25px' }}
                />
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
