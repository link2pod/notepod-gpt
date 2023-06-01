"use client"

import { useSession } from "@inrupt/solid-ui-react";
import Link from "next/link";
import { useState } from "react";

export default function (){

    const [hidden, setHidden] = useState(true)
    const {session} = useSession()

    return ( 
    <div className="bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
                <Link href="#" className="text-white text-lg font-semibold">Logo</Link>
                <div className="hidden sm:block">
                <div className="ml-10 flex items-baseline space-x-4">
                    <Link href="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md">Home</Link>
                    <Link href="#" className="text-gray-300 hover:text-white px-3 py-2 rounded-md">About</Link>
                    <Link href="#" className="text-gray-300 hover:text-white px-3 py-2 rounded-md">Contact</Link>
                    <Link href="/editor" className="text-gray-300 hover:text-white px-3 py-2 rounded-md">Editor</Link>
                </div>
                </div>
            </div>
            { session.info.isLoggedIn ? 
                <div className="hidden sm:block text-gray-300 hover:text-white px-3 py-2 rounded-md">
                    Logout
                </div> : 
                <div className="hidden sm:block">
                    <Link href="/auth" className="text-gray-300 hover:text-white px-3 py-2 rounded-md">Login</Link>
                    <Link href="/auth" className="text-gray-300 hover:text-white px-3 py-2 rounded-md">Sign up</Link>
                </div>
            }
            <div className="-mr-2 flex sm:hidden">
                <button onClick={() => setHidden(!hidden)} type="button" className="text-gray-300 hover:text-white focus:outline-none focus:text-white">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
                </button>
            </div>
            </div>
        </div>

        {/*<!-- Mobile menu, show/hide based on menu state. -->*/}
        <div className={`sm:hidden ${hidden ? "hidden" : ""}`} id="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md">Home</Link>
            <Link href="#" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md">About</Link>
            <Link href="#" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md">Contact</Link>
            <Link href="/editor" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md">Editor</Link>
            </div>
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="#" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md">Login</Link>
            <Link href="#" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md">Sign up</Link>
            </div>
        </div>
    </div>)
}
