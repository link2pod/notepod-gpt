"use client"

import { useSession, CombinedDataProvider, Text } from "@inrupt/solid-ui-react";
import { useRouter } from "next/navigation";
import useGetDatabase from "../hooks/useGetDatabase";
import { useContext } from "react";
import { SolidContext } from "../context-providers";

export default function (){
    const { session, sessionRequestInProgress } = useSession()
    const router = useRouter()
    const {selectedPodUrl} = useContext(SolidContext)

    if (!session.info.isLoggedIn) {
        router.push('/auth')
        return (<>Redirecting to Login...</>)
    }

    if (!selectedPodUrl) {return <>No pod selected</>}
    const {loading, entries} = useGetDatabase({podUrl: selectedPodUrl})
    
    if (sessionRequestInProgress || loading) return (<>"Loading..."</>)

    return (<>
        Success! Editor
        {/* 
        <CombinedDataProvider datasetUrl={webId} thingUrl={webId}>
            <Text propertyUrl="http://www.w3.org/2006/vcard/ns#fn" edit autosave/>
        </CombinedDataProvider>
        */}
    </>)
}
