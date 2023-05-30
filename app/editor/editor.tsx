"use client"

import { useSession, CombinedDataProvider, Text } from "@inrupt/solid-ui-react";
import { useRouter } from "next/navigation";
import Login from "../auth/login";

export default function (){
    const { session, sessionRequestInProgress } = useSession()
    const router = useRouter()

    if (!session.info.isLoggedIn) {
        router.push('/auth')
        return (<>Go login</>)
    }

    if (sessionRequestInProgress) return (<>"Loading..."</>)

    const webId = session.info.webId
    console.log(webId)

    return (<>
        Success! Editor: 
        {/*
        <CombinedDataProvider datasetUrl={webId} thingUrl={webId}>
            <Text propertyUrl="http://www.w3.org/2006/vcard/ns#fn" edit autosave/>
        </CombinedDataProvider>
    */}
    </>)
}
