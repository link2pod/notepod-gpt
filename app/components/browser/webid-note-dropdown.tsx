"use client"

import {  getPodUrlAllFrom, getProfileAll,} from "@inrupt/solid-client";
import { useSession } from "@inrupt/solid-ui-react";
import { useState } from "react";
import { SOLID } from "@inrupt/vocab-solid"
import { getRootContainer, getTypeIndexUrl } from "../../lib/utilities";
import useSWR from 'swr'
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
        (!rootStorages || rootStorages.length === 0) ? 'rootStorage' : null, 
        (_) => getRootContainer(props.webId), 
        {revalidateIfStale: false, revalidateOnFocus: false}
    ) 

    const rootStorage = rootStorages && rootStorages[0] ? rootStorages[0] : rootPod

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
            {privateTypeIndexUrl  && rootStorage && <TypeIndexDropdown 
                typeIndexUrl={privateTypeIndexUrl}
                storageUrl={`${rootStorage}private-notes/`}
                title="Private Notes"
            />}
            {publicTypeIndexUrl  && rootStorage && <TypeIndexDropdown 
                typeIndexUrl={publicTypeIndexUrl}
                storageUrl={`${rootStorage}public-notes/`}
                title="Public Notes"
            />}
            {/**TODO: Display dropdown for root storage and other PIM:storages */}
        </DropdownBody>
    </div>
    )
}



