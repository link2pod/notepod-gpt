"use client"

import { BsChevronRight } from "react-icons/bs"
import Spinner from "../spinner"
import { ReactNode, useState } from "react"


type anyfn = (..._:any[]) => any

/**
 * @param props.isOpen whether dropdown content is shown 
 * @param props.handleToggleDropdown Function called when dropdown button is clicked
 * @returns 
 */
export function DropdownButton(props: {
    isOpen: boolean, 
    handleToggleDropdown: anyfn,
}){
    return (<BsChevronRight
        className={`hover:fill-primary my-auto ${props.isOpen ? "rotate-90" : ""} fill-gray-500`}
        onClick={props.handleToggleDropdown} 
    />)
}

/**
 * @param props props
 * @param props.padding number representing tailwindcss padding class number (i.e. 0,1,4,...)
 * @param props.showLinedrop display indentation line on left when hovered
 * @param props.isLoading shows loading spinner when true 
 * @returns styled JSX component that's hidden. 
 * Content is shown when props.isOpen is true. 
 * If not loading, shows error if props.error is defined 
 * If not loading, and no error, then render props.children
 */
export function DropdownBody(props: {
    isOpen: boolean, 
    children: ReactNode
    isLoading?: boolean, 
    error?: any,
    padding?: number,
    showLinedrop?: boolean,
}) {
    const [hovering, setHovering] = useState(false)
    return (
        <div 
            className={`flex h-full ${props.isOpen? "" : "hidden"} pl-${props.padding ? props.padding : 0}`}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
        >
            <div className={`border-${(props.showLinedrop && hovering) ? "gray-200" : "transparent"} h-full w-1 border-r-2 `}/>
            <div className={`grid grid-cols-1 py-1 w-full`}>
                {props.isLoading ? <Spinner /> 
                : props.error ? <div>{props.error}</div>
                : <>{props.children} </> }
            </div>
        </div>
    )
}


const Dropdown = {
    Body: DropdownBody,
    Button: DropdownButton,
}

export default Dropdown
