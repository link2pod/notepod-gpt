"use client"

import { Dialog } from '@headlessui/react'
import { useRouter } from 'next/navigation'
import { useSession } from '@inrupt/solid-ui-react'
import { useState } from 'react'

// Renders login and signup forms in a modal
export default function MyDialog() {
    const [isOpen, setIsOpen] = useState(true)
    const { session } = useSession()
    const router = useRouter()

    return (
    <Dialog
        open={isOpen}
        onClose={() => {
            setIsOpen(false)
            router.push("/")
        }}
        className="relative z-50"
    >
        {/* The backdrop, rendered as a fixed sibling to the panel container */}
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        {/* Full-screen container to center the panel */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
        {/* The actual dialog panel  */}
        <Dialog.Panel className="mx-auto max-w-sm rounded bg-white grid grid-cols-1 justify-center">
            Auth Dialogue
        </Dialog.Panel>
        </div>
    </Dialog>
    )
}
