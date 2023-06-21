"use client"

import { SolidDataset, buildThing, createContainerInContainer, createThing, getPodUrlAll, getSolidDataset, getSolidDatasetWithAcl, getSourceIri, getThing, getThingAll, getWebIdDataset, saveSolidDatasetAt, setThing } from "@inrupt/solid-client"
import { getDefaultSession } from "@inrupt/solid-client-authn-browser"
import { useSession } from "@inrupt/solid-ui-react"
import { SOLID } from "@inrupt/vocab-solid"
import { useState } from "react"
import { NoteDigitalDocument, getPrivateTypeIndexUrl, getRootContainer, } from "../../lib/utilities"
import { RDF, SCHEMA_INRUPT } from "@inrupt/vocab-common-rdf"

export default function(props: {
    webId: string
}| {
    parentContainerUrl: string,
}){
    const {session} = useSession()
    
    const handleAdd = async () => {
        if ("parentContainerUrl" in props) { 
            // add container to container 
            const res = await createContainerInContainer(props.parentContainerUrl, {
                slugSuggestion: "new container", 
                fetch: session.fetch,
            })
        }
        else {
            const getStorageUrl = async() => {
                const podUrls = await getPodUrlAll(props.webId, {fetch: session.fetch})
                const webId = await getWebIdDataset(props.webId)
                return podUrls.length === 0 ? await getRootContainer(props.webId): podUrls[0]
            }
            const [privateTypeIndexUrl,storageUrl] = await Promise.all([
                getPrivateTypeIndexUrl(props.webId), 
                getStorageUrl(),
            ])

            const res = await createContainerInContainer(storageUrl, {
                slugSuggestion: "new container", 
                fetch: session.fetch,
            })

            if (privateTypeIndexUrl){
                const typeIndexDataset = await getSolidDataset(privateTypeIndexUrl, {
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
