"use client"

import { useEffect, useState } from 'react'
import { Dialog } from '@headlessui/react'
import Login from './login'
import Signup from './signup'
import { useRouter } from 'next/navigation'
import { useSession } from '@inrupt/solid-ui-react'
import Loading from './loading'
import Logout from './logout'

// Renders login and signup forms in a modal
export default function AuthPage() {
    const {session, sessionRequestInProgress} = useSession()
    const router = useRouter()
    if (session.info.isLoggedIn) {
        router.push("/")
        return null
    }

    return (
    <Dialog
        open={true}
        onClose={() => {
            router.back()
        }}
        className="relative z-50"
    >
        {/* The backdrop, rendered as a fixed sibling to the panel container */}
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        {/* Full-screen container to center the panel */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
        {/* The actual dialog panel  */}
        {sessionRequestInProgress ? <Loading /> : 
            <><Dialog.Panel className="mx-auto max-w-sm rounded bg-white grid grid-cols-1 justify-center">
            {session.info.isLoggedIn ? <Logout /> : 
            (<><Dialog.Title className="flex justify-center mt-4 font-bold text-3xl">Login</Dialog.Title>
            <div className="px-4">
                <Login />
            </div> 
            <div className="flex w-full items-center justify-center mt-2">
                <hr className="border border-gray-300 w-1/2 rounded" />
                <span className="mx-1 text-gray-500">or</span>
                <hr className="border border-gray-300 w-1/2 rounded" />
            </div>
            <div className='pb-4'>
                <Signup />
            </div>
            </>)}
        </Dialog.Panel></>}
        </div>
    </Dialog>
    )
}
