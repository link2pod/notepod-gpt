"use client"

import { SolidDataset, Thing, ThingPersisted, buildThing, createContainerInContainer, createSolidDataset, createThing, getIri, getIriAll, getSolidDataset, getSourceIri, getSourceUrl, getThing, getThingAll, getUrl, saveSolidDatasetAt, setThing } from "@inrupt/solid-client"
import {SOLID} from "@inrupt/vocab-solid"
import { useState } from "react"
import { BsChevronRight } from "react-icons/bs"
import { NoteDigitalDocument, getContainerUrlPostfix } from "../../lib/utilities"
import Spinner from "../spinner"
import { Popover } from "@headlessui/react"
import AddFolderButton from "./add-folder-button"
import AddNoteButton from "./add-note-button"
import { FaEllipsisH } from "react-icons/fa"
import { LDP, RDF } from "@inrupt/vocab-common-rdf"
import { useSession } from "@inrupt/solid-ui-react"
import NoteDatasetItem from "./note-dataset-item"
import NoteContainerDropdown from "./note-container-dropdown"
import useSWR from 'swr'
import OptionsMenu from "./options-menu"
import Dropdown from "./dropdown"
import { useSolidDataset } from "@/app/lib/hooks"

export default function TypeIndexDropdown(props: {
    typeIndexUrl: string,
    storageUrl: string | undefined, 
    title?: string, 
}){
    const [showChildren, setShowChildren] = useState(false)
    const {session} = useSession()

    const {data: typeIndexDataset, isLoading, error, mutate} 
        // (re)fetch data only when showChildren is true
        = useSolidDataset(showChildren ? props.typeIndexUrl : null)
    
    // Filter for all typeRegistrations that have a solid:forClass equal to Schema:NoteDigitalDocument
    // I.e.: get all note registrations as a Thing<instanceContainer | instance>[]
    const noteRegistrations 
        = getThingAll(typeIndexDataset ? typeIndexDataset : createSolidDataset())
        .filter((thing) => getUrl(thing, SOLID.forClass) === NoteDigitalDocument)
    
    const handleToggleDropdown = () => setShowChildren(!showChildren)

    const handleAddFolder = async () => {
        if (!typeIndexDataset ) {
            // Show toast that typeIndex is unavailable (likely some error fetching it) 
            console.error("Type index dataset not found")
            return
        }
        if (!props.storageUrl) {
            console.error("StorageUrl not yet found. Please try again.")
            return
        }
        // createContainer at props.storageUrl
        // TODO: refactor into useSWR hook
        const res = await createContainerInContainer(props.storageUrl, {
            slugSuggestion: "new-container", 
            fetch: session.fetch,
        })

        // create instanceContainer thing linking to newly created container
        const noteRegisterThing = buildThing(createThing())
        .addIri(SOLID.forClass, NoteDigitalDocument)
        .addIri(RDF.type, SOLID.TypeRegistration)
        .addIri(SOLID.instanceContainer, getSourceIri(res))
        .build()

        // add the instanceContainer thing to the index
        const newTypeIndexDataset = setThing(typeIndexDataset, noteRegisterThing) 
        
        // Save to server and update useSWR cache
        mutate(async () => await saveSolidDatasetAt(props.typeIndexUrl, newTypeIndexDataset, {fetch:session.fetch}))
    }

    return (
        <div className="flex flex-col">
            <div className="flex justify-between hover:bg-gray-100 w-full px-2" >
                <div className="flex overflow-clip">
                    <Dropdown.Button isOpen={showChildren} handleToggleDropdown={handleToggleDropdown}/>
                    <p className="text-clip sm:truncate">
                        {props.title ? props.title : props.typeIndexUrl}
                    </p>
                </div>
                <OptionsMenu>
                    {/** Add folder button. Disabled if rootStorage hasn't been retrieved yet */}
                    <button     
                        onClick={handleAddFolder} 
                        disabled={!props.storageUrl}
                    >Add Folder</button>
                </OptionsMenu>
            </div>
            <Dropdown.Body
                isOpen={showChildren}
                isLoading={isLoading}
                error={error}
                padding
            >
                {   // map the noteRegistrations (Thing[] of instanceContainer and instance)
                    // into array of JSX elements
                    noteRegistrations.map((thing, id) => {
                        const instanceContainerIri 
                            = getIri(thing, SOLID.instanceContainer)
                        const instanceIri 
                            = getUrl(thing, SOLID.instance)

                        // ReactChildren key
                        const key = `${props.typeIndexUrl}-${id}`
                        if (instanceContainerIri){ 
                            // if instanceContainer, show containerdropdown
                            return <NoteContainerDropdown 
                                key={key}
                                containerIri={instanceContainerIri}
                            /> 
                        } else if (instanceIri){
                            // if instance, show dataset item
                            return <NoteDatasetItem 
                                key={key}
                                noteDatasetUrl={instanceIri}
                            /> 
                        } else {
                            // Unknown type, return empty element
                            return <></>
                        }
                    })
                }
            </Dropdown.Body>
        </div>
    )
}
