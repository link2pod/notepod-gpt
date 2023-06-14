"use client"

import { Dispatch, SetStateAction, useContext, useState } from "react";

export default function ({selectedPodId, setSelectedPodId, pods}: 
    {selectedPodId: number, setSelectedPodId: Dispatch<SetStateAction<number>>, pods: string[]}){

    return (
        <div className="max-w-md mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Pod Browser</h1>
            {pods.map((pod,index) => (
                <div
                    key={pod}
                    className={`p-2 mb-2 rounded cursor-pointer ${
                        index === selectedPodId ? 'border-primary' : 'border-gray-300'
                    }`}
                    onClick={() => setSelectedPodId(index)}
                >
                <h3 className="text-lg font-bold">Name: {pod}</h3>
                <p className="text-sm">Url: {pod}</p>
                </div>
            ))}
        </div>
    )
}
