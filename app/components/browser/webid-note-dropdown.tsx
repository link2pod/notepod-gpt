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
import OptionsMenu from "./options-menu";
import {DropdownBody, DropdownButton} from "./dropdown";

export default function WebidNoteDropdown(props: {
    webId: string,
}){
    const {session} = useSession()
    const [showChildren, setShowChildren] = useState(false)
    // Fetch profileAll of props.webId
    const {data: profileAll, isLoading, error}  
        = useSWR(showChildren ? props.webId : null, (webId) => {
            return getProfileAll( webId, {fetch: session.fetch}
        )}, {
            revalidateIfStale: false, 
            revalidateOnReconnect: false,
        })
    
    // After profileAll is fetched, get the private and public TypeIndexDatasets
    const [privateTypeIndexUrl, publicTypeIndexUrl ] 
        = profileAll 
            ? [
                getTypeIndexUrl(profileAll, props.webId, SOLID.privateTypeIndex),
                getTypeIndexUrl(profileAll, props.webId, SOLID.publicTypeIndex),
            ] : [undefined, undefined]
    
    // get the rootStorages from the profileAll (null if profileAll is null) 
    const rootStorages = profileAll ? getPodUrlAllFrom(profileAll, props.webId) : null 

    //  If rootStorages is empty array, then get rootStorage manually
    const {data: rootPod} = useSWR(
        // caching key
        (rootStorages && rootStorages.length === 0) ? 'rootStorage' : null, 
        (_) => getRootContainer(props.webId), 
        {revalidateIfStale: false, revalidateOnFocus: false}
    ) 

    const handleOpenDropdown = async () => {
        setShowChildren(!showChildren)
    }

    return (
    <div className=""> 
        <div className="flex justify-evenly w-full border-b pr-2 hover:bg-gray-100" >
            {/* Button to Toggle Dropdown */}
            <DropdownButton isOpen={showChildren} handleToggleDropdown={handleOpenDropdown}/>
            {/* Show props.webId */}
            <div className="overflow-clip truncate">
                {props.webId}
            </div>
            <OptionsMenu>
                <button>Add Folder</button>
                <button>Add Note</button>
                <button>Show All</button>
            </OptionsMenu>
        </div>
        {/* Dropdown Contents. Displays private and public notes in dropdown*/}
        <DropdownBody 
            isOpen={showChildren} 
            isLoading={isLoading}
            error={error}
        >
            {privateTypeIndexUrl  && <TypeIndexDropdown 
                typeIndexUrl={privateTypeIndexUrl}
                storageUrl={rootPod}
                title="Private Notes"
            />}
            {publicTypeIndexUrl  && <TypeIndexDropdown 
                typeIndexUrl={publicTypeIndexUrl}
                storageUrl={rootPod}
                title="Public Notes"
            />}
            {/**TODO: Display dropdown for root storage and other PIM:storages */}
        </DropdownBody>
    </div>
    )
}



