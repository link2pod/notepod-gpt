"use client"

import {  getThingAll } from "@inrupt/solid-client"
import { useContext, useState } from "react"
import { RectangleSkeleton } from "../skeletons"
import { useSolidDataset, useSolidDatasetWithAcl } from "@/app/lib/hooks"
import { SelectedNoteContext } from "@/app/context-providers"
import NoteThingDropdown from "./note-thing-dropdown"

export default function NoteDatasetLoader(props: {
    noteIri: string,
}) {
    // Fetch dataset representing the container (and it's contents)
    const { data, isLoading, }
        = useSolidDataset(props.noteIri)

    const { setSelectedNoteUrl } = useContext(SelectedNoteContext)
    if (!setSelectedNoteUrl) throw new Error("Selected Note Context Required")

    return (
        <>
            {isLoading && !data &&
                <RectangleSkeleton>
                    <p
                        className="text-clip sm:truncate"
                    >
                        {props.noteIri}
                    </p>
                </RectangleSkeleton>
            }
            {data &&
                getThingAll(data).map((noteThing) => <NoteThingDropdown
                    noteThing={noteThing}
                    datasetIRI={props.noteIri}
                    key={noteThing.url}
                />)
            }
        </>
    )
}
