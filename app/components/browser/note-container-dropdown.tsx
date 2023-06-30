"use client"

import { SolidDataset, Thing, ThingPersisted, createContainerInContainer, getIri, getIriAll, getSolidDataset, getSourceIri, getSourceUrl, getThing, getThingAll } from "@inrupt/solid-client"
import {SOLID} from "@inrupt/vocab-solid"
import { useState } from "react"
import { BsChevronRight } from "react-icons/bs"
import { getContainerUrlPostfix } from "../../lib/utilities"
import Spinner from "../spinner"
import { Popover } from "@headlessui/react"
import AddNoteButton from "./add-note-button"
import { FaEllipsisH } from "react-icons/fa"
import { LDP, RDF } from "@inrupt/vocab-common-rdf"
import { useSession } from "@inrupt/solid-ui-react"
import NoteDatasetItem from "./note-dataset-item"
import OptionsMenu from "./options-menu"
import Dropdown from "./dropdown"
import useSWR from 'swr'
import { RectangleSkeleton } from "../skeletons"
import { useSolidDataset } from "@/app/lib/hooks"

export default function NoteContainerDropdown(props: {
    containerIri: string, 
    typeIndexUrl?: string,
}){
    const containerIri = props.containerIri
    const [showChildren, setShowChildren] = useState(false)
    const {session} = useSession()
    
    // Fetch dataset representing the container (and it's contents)
    const {data: containerDataset, isLoading, mutate, error, isValidating} 
        = useSolidDataset(containerIri)

    const handleOpenDropdown = () => setShowChildren(!showChildren) 

    const handleAddFolder = async () => {
        // createContainer at props.storageUrl
        await createContainerInContainer(containerIri, {
            slugSuggestion: "new-container", 
            fetch: session.fetch, 
        })
        // update useSWR cache
        mutate()
    }

    return (
        <div className="flex flex-col">
            <div className="flex justify-between hover:bg-gray-100 w-full rounded px-2 " >
                <div className="flex overflow-clip">
                    <Dropdown.Button isOpen={showChildren} handleToggleDropdown={handleOpenDropdown}/>
                    <p className="text-clip sm:truncate">
                        {getContainerUrlPostfix(containerIri.substring(0,containerIri.length-1))}
                    </p>
                </div>
                <OptionsMenu>
                    <AddNoteButton parentUrl={props.containerIri}/>
                    <button onClick={handleAddFolder}>Add Folder</button>
                </OptionsMenu>
            </div>
            <Dropdown.Body 
                isOpen={showChildren} showLinedrop padding
                isLoading={isLoading} isValidating={isValidating}>
                {
                    containerDataset && getIriAll(
                        getThing(containerDataset, containerIri) as ThingPersisted, 
                        LDP.contains,
                    ).map ((noteThingIri) => {
                        const noteThing = getThing(containerDataset, noteThingIri)
                        if (!noteThing) {return null}
                        if (getIriAll(noteThing, RDF.type).find((typeIri) => {
                            return typeIri === LDP.Container
                        })){
                            return <NoteContainerDropdown 
                                containerIri={noteThingIri}
                                key={noteThingIri}
                            />
                        }
                        return <NoteDatasetItem 
                            noteDatasetUrl={noteThingIri} 
                            key={noteThingIri}/>
                    })
                }
            </Dropdown.Body>
        </div>
    )
}
