"use client"

import { SolidDataset, Thing, addIri, buildThing, createSolidDataset, createThing, getIri, getPodUrlAll, getPodUrlAllFrom, getProfileAll, getSolidDataset, getSourceUrl, getThing, getThingAll, getUrl, getUrlAll, saveSolidDatasetAt, setIri, setThing } from "@inrupt/solid-client";
import { useSession } from "@inrupt/solid-ui-react";
import { useContext, useState } from "react";
import {Disclosure, Popover} from "@headlessui/react"
import {BsChevronRight} from "react-icons/bs"
import {FaEllipsisH} from "react-icons/fa"
import Spinner from "./spinner";
import { FOAF, RDF, SCHEMA_INRUPT } from "@inrupt/vocab-common-rdf";
import { SOLID } from "@inrupt/vocab-solid"
import NoteContainerDropdown from "./note-container-dropdown"
import AddNoteButton from "./add-note-button";
import AddFolderButton from "./add-folder-button";
import { NoteDigitalDocument, getPrivateTypeIndexUrl, getRootContainer } from "../lib/utilities";

export default function(props: {
    webId: string,
}){
    const {session} = useSession()
    const [loading, setLoading] = useState(false)
    const [privateTypeIndexDataset, setPrivateTypeIndexDataset] = useState(
        undefined as undefined | SolidDataset
    )
    const [showChildren, setShowChildren] = useState(false)
    
    const handleOpenDropdown = async () => {
        setShowChildren(!showChildren)
        if (!showChildren){
            setLoading(true)
            try{
                const privateTypeIndexUrl = await getPrivateTypeIndexUrl(props.webId)

                if (!privateTypeIndexUrl){
                    const profile = await getProfileAll(props.webId, {fetch: session.fetch})
                    const podUrls = getPodUrlAllFrom(profile, props.webId)
                    var webIdThing = getThing(profile.webIdProfile, props.webId)
                    if (!webIdThing) throw new Error("Invalid solid profile")
                    var storage = podUrls[0]
                    if (!storage){
                        const rootContainer = await getRootContainer(props.webId);
                        webIdThing = addIri(
                            webIdThing, 
                            "http://www.w3.org/ns/pim/space#storage", 
                            rootContainer,
                        )
                        storage = rootContainer
                    }
                    const newPublicTypeRegistrationUrl = `${storage}/public/publicTypeRegistration.ttl`
                    const publicTypeIndexDataset = await saveSolidDatasetAt(
                        newPublicTypeRegistrationUrl, 
                        createSolidDataset(), 
                        {fetch: session.fetch}
                    )
                    // add publicTypeIndex to user profile
                    
                    const newwebIdThing = setIri(webIdThing, SOLID.typeIndex, newPublicTypeRegistrationUrl)
                    // TODO: update extended profile instead of webId

                    const newProfileDataset = setThing(profile.webIdProfile, newwebIdThing)
                    const res = await saveSolidDatasetAt(
                        getSourceUrl(profile.webIdProfile), 
                        newProfileDataset, 
                        {fetch: session.fetch}
                    )
                }
            
                if (privateTypeIndexUrl){
                    // get all notes linked to private registration as array of {Thing, Url}
                    const typeIndexDataset = await getSolidDataset(privateTypeIndexUrl, {fetch: session.fetch})
                    
                    setPrivateTypeIndexDataset(typeIndexDataset)
                }
            } catch(err) {console.error(err)}
            setLoading(false)
        }
    }

    return (
    <div> 
        <div className="flex justify-evenly hover:bg-gray-100 w-full border-b" 
        >
            <BsChevronRight 
                className={`hover:fill-primary my-auto ${showChildren ? "rotate-90" : ""} `}
                onClick={handleOpenDropdown} 
            />
            {props.webId}
            <Popover >
                <Popover.Button className={"w-6 h-full pl-1 mr-0"} as="div">
                    <FaEllipsisH className="fill-black hover:fill-primary w-full h-full"/>
                </Popover.Button>
                <Popover.Panel 
                    className="absolute grid grid-cols-1 -ml-10 -mt-16 border border-gray-500 rounded"
                >
                    <AddFolderButton 
                        webId={props.webId}
                    />
                </Popover.Panel>
            </Popover>
        </div>
        <div className={`grid grid-cols-1 pl-4 py-1 ${showChildren ? "" : "hidden"}`}>
            {loading ? <Spinner /> : <>
                { privateTypeIndexDataset && getThingAll(privateTypeIndexDataset).filter((thing) => 
                        getUrl(thing, SOLID.forClass) === NoteDigitalDocument
                    ).map((thing) => {
                        const instanceContainerIri = getIri(thing, SOLID.instanceContainer)
                        if (instanceContainerIri)
                            return <NoteContainerDropdown 
                                containerIri={instanceContainerIri}
                            /> 
                        else if (getUrl(thing, SOLID.instance)){
                            return <>Note Item </>
                        }
                    })
                }
            </> }
        </div>
    </div>
    )
}



