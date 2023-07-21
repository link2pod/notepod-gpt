"use client"

import { SolidDataset, Thing, ThingPersisted, addIri, createContainerInContainer, getIri, getIriAll, getSolidDataset, getSourceIri, getSourceUrl, getStringNoLocale, getThing, getThingAll, getUrl, saveSolidDatasetAt, setStringNoLocale, setThing } from "@inrupt/solid-client"
import { ChangeEventHandler, FormEventHandler, MutableRefObject, RefObject, useContext, useRef, useState } from "react"
import { SCHEMA, addNoteToContainer, getContainerUrlPostfix, getUrlPrefix } from "../../lib/utilities"
import { LDP, RDF, SCHEMA_INRUPT } from "@inrupt/vocab-common-rdf"
import OptionsMenu from "./options-menu"
import Dropdown from "./dropdown"
import useSWR from 'swr'
import { RectangleSkeleton } from "../skeletons"
import { useSolidDataset, useSolidDatasetWithAcl } from "@/app/lib/hooks"
import { SelectedNoteContext } from "@/app/context-providers"
import NoteDatasetLoader from "./note-dataset-loader"
import { useSession } from "@inrupt/solid-ui-react"

export default function NoteThingDropdown(props: {
    noteThing: Thing,
    datasetIRI: string,
}) {
    const nameTextRef = useRef<HTMLInputElement>(null);
    const { session } = useSession()
    const [showChildren, setShowChildren] = useState(false)
    const { data, isValidating, mutate } = useSolidDataset(props.datasetIRI)

    const handleOpenDropdown = () => setShowChildren(!showChildren)
    console.log(data)

    const handleAddChildNote = async () => {
        // Buttons/onclicks that call this function should be disabled when data is undefined
        if (!data) throw Error("Data not yet loaded")
        const containerIRI = getUrlPrefix(props.datasetIRI)
        const parentNoteIRI = props.noteThing.url
        const newNoteDataset = await addNoteToContainer(containerIRI, session.fetch, parentNoteIRI)
        const newNoteThing = getThingAll(newNoteDataset)[0]
        if (!newNoteThing) throw Error("New Note Thing not created")
        const newParentNoteThing = addIri(props.noteThing, SCHEMA.hasPart, newNoteThing.url)
        const newDataset = setThing(data, newParentNoteThing)
        const res = await saveSolidDatasetAt(props.datasetIRI, newDataset, { fetch: session.fetch })
        // update useSWR cache
        mutate(res)
    }

    const saveName = async (newname: string) => {
        // Buttons/onclicks that call this function should be disabled when data is undefined
        if (!data) throw Error("Data not yet loaded")
        const newNoteThing = setStringNoLocale(props.noteThing, SCHEMA_INRUPT.name, newname)
        const newDataset = setThing(data, newNoteThing)
        const res = await saveSolidDatasetAt(props.datasetIRI, newDataset, { fetch: session.fetch })
        // update useSWR cache
        mutate(res)
    }

    console.log(isValidating, props.noteThing, nameTextRef)
    const noteName = getStringNoLocale(props.noteThing, SCHEMA_INRUPT.name)
    const handleEditName = () => { 
        console.log(nameTextRef)
        if (nameTextRef.current) 
            nameTextRef.current.focus() 
    }

    const { setSelectedNoteUrl } = useContext(SelectedNoteContext)
    if (!setSelectedNoteUrl) throw new Error("Selected Note Context Required")


    return (
        <div className="flex flex-col">
            <div className="flex justify-between hover:bg-gray-100 w-full rounded px-2 "
                onClick={() => setSelectedNoteUrl(props.datasetIRI)}
            >
                <div className="flex overflow-clip">
                    <Dropdown.Button isOpen={showChildren} handleToggleDropdown={handleOpenDropdown} />
                    <p
                        className="text-clip sm:truncate"
                    >
                        <EditableText reference={nameTextRef} onSubmit={saveName} value={noteName ? noteName : ""} />
                    </p>
                </div>
                <OptionsMenu>
                    <button onClick={handleAddChildNote} disabled={!data}>Add Child Note</button>
                    <button onClick={handleEditName} disabled={!data}>Edit Name</button>
                </OptionsMenu>
            </div>
            <Dropdown.Body
                isOpen={showChildren} showLinedrop padding
                isValidating={isValidating}
            >
                {getIriAll(props.noteThing, SCHEMA.hasPart)
                    .map((partDatasetIRI) =>
                        <NoteDatasetLoader noteIri={partDatasetIRI} key={partDatasetIRI} />
                    )
                }
            </Dropdown.Body>
        </div>
    )
}

function EditableText(props: {
    onSubmit: (text: string) => any,
    value: string,
    reference: RefObject<HTMLInputElement>,
}) {
    const [text, setText] = useState(props.value)
    return (
        <form
            onSubmit={(e) => { 
                e.preventDefault(); 
                props.onSubmit(text); 
                props.reference.current?.blur()
            }}
        >
        <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            ref={props.reference}
            className="border-1 pl-1 rounded bg-transparent"
        />
        </form>
    )
}
