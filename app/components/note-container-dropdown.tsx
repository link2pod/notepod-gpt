"use client"

import { SolidDataset, Thing, ThingPersisted, getIri, getIriAll, getSolidDataset, getSourceIri, getSourceUrl, getThing, getThingAll } from "@inrupt/solid-client"
import {SOLID} from "@inrupt/vocab-solid"
import { useState } from "react"
import { BsChevronRight } from "react-icons/bs"
import { getContainerUrlPostfix } from "../lib/utilities"
import Spinner from "./spinner"
import { Popover } from "@headlessui/react"
import AddFolderButton from "./add-folder-button"
import AddNoteButton from "./add-note-button"
import { FaEllipsisH } from "react-icons/fa"
import { LDP, RDF } from "@inrupt/vocab-common-rdf"
import { useSession } from "@inrupt/solid-ui-react"
import NoteDatasetItem from "./note-dataset-item"

export default function NoteContainerDropdown(props: {
    containerIri: string, 
    typeIndex?: SolidDataset,
}){
    const [loading, setLoading] = useState(false)
    const [showChildren, setShowChildren] = useState(false)
    const [containerDataset, setContainerDataset] = useState(undefined as undefined | SolidDataset)
    const {session} = useSession()
    const containerIri = props.containerIri
    console.log(containerDataset)

    const handleOpenDropdown = async () => {
        setShowChildren(!showChildren)
        if (!showChildren){
            setLoading(true)
            try{
                const noteContainerDataset = await getSolidDataset(
                    containerIri,
                    {fetch: session.fetch},
                )
                setContainerDataset(noteContainerDataset)
            } catch(err){console.error(err)}
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col">
            <div className="flex justify-between hover:bg-gray-100 w-full rounded px-2 " >
                <BsChevronRight 
                    className={`hover:fill-primary my-auto ${showChildren ? "rotate-90" : ""} `}
                    onClick={handleOpenDropdown} 
                />
                    {getContainerUrlPostfix(containerIri.substring(0,containerIri.length-1))}
                <Popover >
                    <Popover.Button className={"w-6 h-full pl-1 mr-0"} as="div">
                        <FaEllipsisH className="fill-black hover:fill-primary w-full h-full"/>
                    </Popover.Button>
                    <Popover.Panel 
                        className="absolute grid grid-cols-1 -ml-24 -mt-28 border rounded border-gray-500 bg-gray-500"
                    >
                        <AddNoteButton 
                            parentUrl={containerIri}
                        />
                        <AddFolderButton
                            parentContainerUrl={containerIri}
                        />
                    </Popover.Panel>
                </Popover>
            </div>
            <div className={`flex h-full ${showChildren ? "" : "hidden"}`}>
                <div className="pl-4 h-full w-1 border-r-2 border-transparent hover:border-gray-200 "/>
                <div className={`grid grid-cols-1 py-1 w-full`}>
                    {loading ? <Spinner /> : <>
                        {
                            containerDataset && getIriAll(
                                getThing(containerDataset, containerIri) as ThingPersisted, 
                                LDP.contains,
                            ).map ((noteThingIri) => {
                                const noteThing = getThing(containerDataset, noteThingIri)
                                if (!noteThing) {return null}
                                if (getIriAll(noteThing, RDF.type).find((typeIri) => {
                                    console.log(typeIri)
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
                    </> }
                </div>
            </div>
        </div>
    )
}
