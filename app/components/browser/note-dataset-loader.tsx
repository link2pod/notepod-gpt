"use client"

import { SolidDataset, Thing, ThingPersisted, createContainerInContainer, getIri, getIriAll, getSolidDataset, getSourceIri, getSourceUrl, getThing, getThingAll } from "@inrupt/solid-client"
import { SOLID } from "@inrupt/vocab-solid"
import { useContext, useState } from "react"
import { BsChevronRight } from "react-icons/bs"
import { getContainerUrlPostfix } from "../../lib/utilities"
import Spinner from "../spinner"
import { Popover } from "@headlessui/react"
import AddNoteButton from "./add-note-button"
import { FaEllipsisH } from "react-icons/fa"
import { LDP, RDF } from "@inrupt/vocab-common-rdf"
import { useSession } from "@inrupt/solid-ui-react"
import OptionsMenu from "./options-menu"
import Dropdown from "./dropdown"
import useSWR from 'swr'
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
