"use client"

import { Dispatch, ReactNode, SetStateAction } from 'react'
import { Dialog } from '@headlessui/react'
import {IoIosCloseCircleOutline} from 'react-icons/io'

// Renders sharing interface for 
export default function (props: {
    isOpen: boolean, 
    setIsOpen: Dispatch<SetStateAction<boolean>>,
    title?: string , 
    children: ReactNode,
}) {
    return (
    <Dialog
        open={props.isOpen}
        onClose={() => {
            props.setIsOpen(false)
        }}
        className="relative z-50"
    >
        {/* The backdrop, rendered as a fixed sibling to the panel container */}
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        {/* Full-screen container to center the panel */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
        {/* The actual dialog panel  */}
        <Dialog.Panel className="flex flex-col w-2/3 h-2/3 rounded bg-white">
            {/** Dialog title */}
            <Dialog.Title className="relative w-full pb-1 mt-4 font-bold text-3xl" as='div'>
                <div className='flex justify-center w-full'>
                    {props.title}
                </div>
                <div 
                    className='absolute right-0 inset-y-0 mr-2 hover:cursor-pointer' 
                    onClick={() => props.setIsOpen(false)}
                ><IoIosCloseCircleOutline className='fill-gray-500 hover:fill-primary'/></div>
            </Dialog.Title>
            <hr className="border border-gray-300 w-full rounded mt-1" />
            <div className='flex-grow w-full'> {props.children} </div>
        </Dialog.Panel>
        </div>
    </Dialog>)
}


