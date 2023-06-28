"use client"

import { SolidDataset, Thing, addIri, buildThing, createSolidDataset, createThing, getIri, getPodUrlAll, getPodUrlAllFrom, getProfileAll, getSolidDataset, getSourceUrl, getThing, getThingAll, getUrl, getUrlAll, saveSolidDatasetAt, setIri, setThing } from "@inrupt/solid-client";
import { useSession } from "@inrupt/solid-ui-react";
import { useState } from "react";
import { Popover} from "@headlessui/react"
import {BsChevronRight} from "react-icons/bs"
import {FaEllipsisH} from "react-icons/fa"
import Spinner from "../spinner";
import { SOLID } from "@inrupt/vocab-solid"
import NoteContainerDropdown from "./note-container-dropdown"
import AddFolderButton from "./add-folder-button";
import { GetProfileAll, NoteDigitalDocument, getRootContainer, getTypeIndexUrl } from "../../lib/utilities";
import useSWR from 'swr'
import { getDefaultSession } from "@inrupt/solid-client-authn-browser";
import TypeIndexDropdown from "./typeindex-dropdown";

export default function WebidNoteDropdown(props: {
    webId: string,
}){
    const {session} = useSession()
    const [showChildren, setShowChildren] = useState(false)
    // Fetch profileAll of props.webId
    const {data: profileAll, isLoading, error}  
        = useSWR(showChildren ? props.webId : null, (webId) => {
            console.log("From profileAll fetcher", session.info)
            return getProfileAll( webId, {fetch: getDefaultSession().fetch}
        )})
    
    // After profileAll is fetched, get the private and public TypeIndexDatasets
    const [privateTypeIndexUrl, publicTypeIndexUrl] 
        = profileAll 
            ? [
                getTypeIndexUrl(profileAll, props.webId, SOLID.privateTypeIndex),
                getTypeIndexUrl(profileAll, props.webId, SOLID.publicTypeIndex),
            ] : [undefined, undefined]

    const handleOpenDropdown = async () => {
        setShowChildren(!showChildren)
        if (!showChildren){
            /*
            try{
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
            } catch(err) {console.error(err)}
            */
        }
    }

    return (
    <div> 
        <div className="flex justify-evenly hover:bg-gray-100 w-full border-b pr-2" 
        >
            {/* Button to Toggle Dropdown */}
            <BsChevronRight 
                className={`hover:fill-primary my-auto ${showChildren ? "rotate-90" : ""} `}
                onClick={handleOpenDropdown} 
            />
            {/* Show props.webId */}
            <div className="overflow-clip truncate">
                {props.webId}
            </div>
            {/* Show Extended options */}
            <Popover>
                {/* Button to open extended options menu*/}
                <Popover.Button className={"w-6 h-full pl-1 mr-0"} as="div">
                    <FaEllipsisH className="fill-black hover:fill-primary w-full h-full"/>
                </Popover.Button>
                {/** Extended options menu. Displays 
                 * - Add folder button 
                */}
                <Popover.Panel 
                    className="absolute grid grid-cols-1 -ml-10 -mt-16 border border-gray-500 rounded"
                >
                    <AddFolderButton 
                        webId={props.webId}
                    />
                </Popover.Panel>
            </Popover>
        </div>
        <div className={`grid grid-cols-1 pl-4 py-1 ${showChildren ? "" : "hidden"} `}>
            { // Show spinner if profile is being fetched. 
              // Show error if there's error fetching
              // Else, show dropdowns for private and public type indexes, as appropriate
            isLoading ? <Spinner /> 
            : error ? <div>{error}</div>
            : <>
                {privateTypeIndexUrl  && <TypeIndexDropdown 
                    typeIndexUrl={privateTypeIndexUrl}
                    title="Private Notes"
                />}
                {publicTypeIndexUrl  && <TypeIndexDropdown 
                    typeIndexUrl={publicTypeIndexUrl}
                    title="Public Notes"
                />}
            </> }
        </div>
    </div>
    )
}



