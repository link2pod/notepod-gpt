"use client"

import { useSession } from "@inrupt/solid-ui-react";
import Link from "next/link";
import { useState } from "react";
import logo from "@/public/logo.svg"
import Image from "next/image";
import MockQuizModal from "./mock-quiz-modal";

export default function NavBar(){

    const [hidden, setHidden] = useState(true)
    const [showMockQuizModal, setShowMockQuizModal] = useState(false)
    const {session} = useSession()

    return ( 
    <div className="bg-neutral">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
                <Link href="#" className="h-16"><Image src={logo} alt="logo" className="relative h-full"/></Link>
                <div className="hidden sm:block">
                <div className="ml-10 flex items-baseline space-x-4">
                    <Link href="/">Editor</Link>
                    <a onClick={() => setShowMockQuizModal(true)}>Mock Quiz</a>
                </div>
                </div>
            </div>
            { session.info.isLoggedIn ? 
                <div className="hidden sm:block" onClick={session.logout}>
                    <Link href="/auth"> Logout </Link>
                </div> : 
                <div className="hidden sm:block">
                    <Link href="/auth">Login</Link>
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
        <div className={`grid grid-cols-1 justify-center sm:hidden ${hidden ? "hidden" : ""}`} id="mobile-menu">
            <Link href="/">Editor</Link>
            { session.info.isLoggedIn ? 
                <div onClick={session.logout}>
                    <Link href="/auth"> Logout </Link>
                </div> : 
                <div>
                    <Link href="/auth">Login</Link>
                </div>
            }
        </div>
        {/** Modals */}
        <MockQuizModal 
            setIsOpen={(b) => setShowMockQuizModal(b)}
            isOpen={showMockQuizModal}
        />
    </div>)
}
