import { Popover } from "@headlessui/react";
import { ReactNode } from "react";
import { FaEllipsisH } from "react-icons/fa";


/**
 * 
 * @param props 
 * @param props.children Option menu items
 * @returns Button that when clicked will open pop-up menu below the button
 */
export default function OptionsMenu(props: {
    children: ReactNode,
}){
    return (
        <Popover as="div" className="relative">
            {/* Button to open extended options menu*/}
            <Popover.Button className="w-6" as="div">
                <FaEllipsisH className="fill-black hover:fill-primary w-full h-full"/>
            </Popover.Button>
            <Popover.Panel 
                className="absolute flex flex-col right-0 top-0 mt-4 w-40 border rounded border-gray-500 bg-gray-500"
                as="div"
            >
            {/** Extended options menu.  */}
                {props.children}
            </Popover.Panel>
        </Popover>
    )
}
