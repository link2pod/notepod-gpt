"use client"

import { Dispatch, SetStateAction, useContext, useState } from "react";

export default function ({selectedPodUrl, setSelectedPodUrl, pods}: 
    {selectedPodUrl: string, setSelectedPodUrl: Dispatch<SetStateAction<string>>, pods: string[]}){

    return (
        <div className="max-w-md mx-auto p-4">
            {pods.map((pod) => (
                <div
                    key={pod}
                    className={`p-2 mb-2 rounded cursor-pointer ${
                        pod === selectedPodUrl ? 'border-primary' : 'border-gray-300'
                    }`}
                    onClick={() => setSelectedPodUrl(pod)}
                >
                <h3 className="text-lg font-bold">Name: {pod}</h3>
                <p className="text-sm">Url: {pod}</p>
                </div>
            ))}
        </div>
    )
}
