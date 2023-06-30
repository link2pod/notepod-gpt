import { ReactNode } from "react"

export function RectangleSkeleton(props:{
    children?: ReactNode,
}) {
    return (
        <div className="w-full h-full bg-gray-200 animate-pulse rounded mb-8">
            {props.children}
        </div>
    )
}