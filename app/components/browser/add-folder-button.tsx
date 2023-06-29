"use client"

import { SolidDataset, buildThing, createContainerInContainer, createThing, getPodUrlAll, getProfileAll, getSolidDataset, getSolidDatasetWithAcl, getSourceIri, getThing, getThingAll, getWebIdDataset, saveSolidDatasetAt, setThing } from "@inrupt/solid-client"
import { getDefaultSession } from "@inrupt/solid-client-authn-browser"
import { useSession } from "@inrupt/solid-ui-react"
import { SOLID } from "@inrupt/vocab-solid"
import { useState } from "react"
import { NoteDigitalDocument, getTypeIndexUrl, getRootContainer, } from "../../lib/utilities"
import { RDF, SCHEMA_INRUPT } from "@inrupt/vocab-common-rdf"
import useSWR from 'swr'

export default function AddFolderButton(props: {
    webId: string,
    typeIndexUrl?: string
}| {
    parentContainerUrl: string,
}){
    const {session} = useSession()
    
    // Get storageUrl to store folder in. 
    // Since props.webId might be cached in useSWR, fetch the profileAll 
    // then retrieve podurls from profileAll
    const {data: profileAll, isLoading: loadingProfile} 
        = useSWR("webId" in props ? props.webId: null, 
            (webId) => getProfileAll(webId, {fetch: session.fetch}))
    
    // Get typeIndexDataset if specified so that typeRegistration can be added
    // If not specified, don't add to register
    const {data: typeIndexDataset, isLoading: loadingTypeIndex} 
        = useSWR("typeIndexUrl" in props ? props.typeIndexUrl : null, 
            (url) => getSolidDataset(url, {fetch: session.fetch}))
    
    const handleAdd = async () => {
        if ("parentContainerUrl" in props) { 
            // add container to container 
            const res = await createContainerInContainer(props.parentContainerUrl, {
                slugSuggestion: "new container", 
                fetch: session.fetch,
            })
        }
        else {
            const podUrls = await getPodUrlAll(props.webId, {fetch: session.fetch})
            const storageUrl = podUrls.length === 0 ? await getRootContainer(props.webId): podUrls[0]

            const res = await createContainerInContainer(storageUrl, {
                slugSuggestion: "new container", 
                fetch: session.fetch,
            })

            if (props.typeIndexUrl){
                const typeIndexDataset = await getSolidDataset(props.typeIndexUrl, {
                    fetch: session.fetch
                }); 
                const noteRegisterThing = buildThing(createThing())
                .addIri(SOLID.forClass, NoteDigitalDocument)
                .addIri(RDF.type, SOLID.TypeRegistration)
                .addIri(SOLID.instanceContainer, getSourceIri(res))
                .build()

                const newTypeIndexDataset = setThing(typeIndexDataset, noteRegisterThing) 
                await saveSolidDatasetAt(privateTypeIndexUrl, newTypeIndexDataset, {fetch:session.fetch})
            }
        }
    }

    return (<button onClick={handleAdd}>Add Folder</button>)
}
