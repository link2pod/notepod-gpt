"use client"

import { useSession } from "@inrupt/solid-ui-react"
import { useContext, useState } from "react";
import PodDisplay from "./pod-display";
import useGetPods from "../hooks/useGetPods";
import { SolidContext } from "../context-providers";

export default function (){
    const {session} = useSession()
    const [selectedPodId, setSelectedPodId] = useState(0)
    const {setSelectedPodUrl} = useContext(SolidContext)

    if (!session.info.isLoggedIn) return (<>podselector: not logged in</>)
    const {pods, loading} = useGetPods()
    if (loading) return <>Loading pods</>
    if (!setSelectedPodUrl) throw new Error("Need solid context provider")
    return (<>
        Pod browser 
        <button onClick={(_) => setSelectedPodUrl(pods[selectedPodId])}>Use Selected Pod</button>
        <br />
        <div className="grid grid-flow-col justify-evenly">
        { pods.map((pod, index) => {return <div
            id={`pod-${index}`}
            onClick={(_) => setSelectedPodId(index)}
        >
            <PodDisplay 
            id={index+1} 
            selected={index === selectedPodId}
            pod={pod}
        /></div>}) }
        </div>
    </>)
}
