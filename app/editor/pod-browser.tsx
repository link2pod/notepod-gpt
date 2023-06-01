"use client"

import { useSession } from "@inrupt/solid-ui-react"
import { useContext, useState } from "react";
import PodDisplay from "./pod-display";
import useGetPods from "../lib/useGetPods";
import { SolidContext } from "../context-providers";

export default function (){
    const {session} = useSession()
    const [selectedPodId, setSelectedPodId] = useState(0)
    const {setSelectedPodUrl} = useContext(SolidContext)

    if (!session.info.isLoggedIn) return (<>podselector: not logged in</>)
    const {pods, loading} = useGetPods()
    if (loading) return <>Loading pods</>
    if (!setSelectedPodUrl) throw new Error("Need solid context provider")
    return ( <>
        <div className="max-w-md mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Pod Browser</h1>
            {pods.map((pod,index) => (
                <div
                    key={pod}
                    className={`p-2 mb-2 rounded cursor-pointer ${
                        index === selectedPodId ? 'bg-gray-800' : 'bg-gray-200'
                    }`}
                    onClick={() => setSelectedPodId(index)}
                >
                <h3 className="text-lg font-bold">Name: {pod}</h3>
                <p className="text-sm text-blue-600">Url: {pod}</p>
                </div>
            ))}
        </div>
        <button onClick={(_) => setSelectedPodUrl(pods[selectedPodId])}>Use Selected Pod</button>
    </>)
}
