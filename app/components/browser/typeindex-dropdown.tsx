"use client"

import { Access, SolidDataset, Thing, ThingPersisted, buildThing, createContainerInContainer, createSolidDataset, createThing, getIri, getIriAll, getSolidDataset, getSourceIri, getSourceUrl, getThing, getThingAll, getUrl, saveSolidDatasetAt, setThing } from "@inrupt/solid-client"
import { SOLID } from "@inrupt/vocab-solid"
import { useState } from "react"
import { BsChevronRight } from "react-icons/bs"
import { SCHEMA, addNoteToContainer, getContainerUrlPostfix } from "../../lib/utilities"
import Spinner from "../spinner"
import { Popover } from "@headlessui/react"
import AddNoteButton from "./add-note-button"
import { FaEllipsisH } from "react-icons/fa"
import { LDP, RDF, SCHEMA_INRUPT } from "@inrupt/vocab-common-rdf"
import { useSession } from "@inrupt/solid-ui-react"
import useSWR from 'swr'
import OptionsMenu from "./options-menu"
import Dropdown from "./dropdown"
import { useGetNotesFromTypeIndex, useSolidDataset } from "@/app/lib/hooks"
import NoteDatasetLoader from "./note-dataset-loader"

export default function TypeIndexDropdown(props: {
    typeIndexUrl: string,
    storageUrl: string,
    title?: string,
    defaultAccess?: Access,
}) {
    const [showChildren, setShowChildren] = useState(false)
    const { session } = useSession()

    const { data: typeIndexDataset, isLoading, error, mutate, isValidating }
        // (re)fetch data only when showChildren is true
        = useSolidDataset(showChildren ? props.typeIndexUrl : null)

    const { noteIRIs } = useGetNotesFromTypeIndex(typeIndexDataset, 3, session)

    const handleToggleDropdown = () => setShowChildren(!showChildren)

    const handleAddNote = async () => {
        if (!typeIndexDataset) {
            // Show toast that typeIndex is unavailable (likely some error fetching it) 
            console.error("Type index dataset not found")
            return
        }
        const newNoteDataset
            = await addNoteToContainer(props.storageUrl, session.fetch)

        const noteRegisterThing = buildThing(createThing())
            .addIri(SOLID.forClass, SCHEMA.NoteDigitalDocument)
            .addIri(RDF.type, SOLID.TypeRegistration)
            .addIri(SOLID.instance, getSourceIri(newNoteDataset))
            .build()

        // add the instanceContainer thing to the index
        const newTypeIndexDataset = setThing(typeIndexDataset, noteRegisterThing)


        mutate(
            await saveSolidDatasetAt(props.typeIndexUrl, newTypeIndexDataset, { fetch: session.fetch })
        )
    }

    console.log(noteIRIs)
    return (
        <div className="flex flex-col">
            <div className="flex justify-between hover:bg-gray-100 w-full px-2" >
                <div className="flex overflow-clip">
                    <Dropdown.Button isOpen={showChildren} handleToggleDropdown={handleToggleDropdown} />
                    <p className="text-clip sm:truncate">
                        {props.title ? props.title : props.typeIndexUrl}
                    </p>
                </div>
                <OptionsMenu>
                    {/** Add folder button. Disabled if rootStorage hasn't been retrieved yet */}
                    <button
                        onClick={handleAddNote}
                        disabled={!typeIndexDataset}
                    >Add Note</button>
                </OptionsMenu>
            </div>
            <Dropdown.Body
                isOpen={showChildren}
                isLoading={isLoading}
                isValidating={isValidating}
                error={error}
                padding
            >
                {noteIRIs.map((noteIRI, ind) => <NoteDatasetLoader
                    noteIri={noteIRI}
                    key={`tid${ind}`}
                />)}
            </Dropdown.Body>
        </div>
    )
}
