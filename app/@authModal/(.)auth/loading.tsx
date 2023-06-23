"use client"

import Spinner from "@/app/components/spinner";
import { Dialog } from "@headlessui/react";
import { useRouter } from "next/navigation";

export default function Loading(){
    const router = useRouter()
    return (<Dialog open={true} onClose={()=>{router.back()}} className="relative z-50">
        {/* The backdrop, rendered as a fixed sibling to the panel container */}
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        {/* Full-screen container to center the panel */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="mx-auto max-w-sm rounded bg-white grid grid-cols-1 justify-center">
                <Dialog.Title className="flex justify-center mt-4 font-bold text-3xl">
                    Signing In
                </Dialog.Title>
                <Spinner />
            </Dialog.Panel>
        </div>
    </Dialog>)
}