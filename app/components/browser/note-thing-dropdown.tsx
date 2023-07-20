"use client"

import { SolidDataset, Thing, ThingPersisted, createContainerInContainer, getIri, getIriAll, getSolidDataset, getSourceIri, getSourceUrl, getStringNoLocale, getThing, getThingAll } from "@inrupt/solid-client"
import { SOLID } from "@inrupt/vocab-solid"
import { useContext, useState } from "react"
import { BsChevronRight } from "react-icons/bs"
import { SCHEMA, getContainerUrlPostfix } from "../../lib/utilities"
import Spinner from "../spinner"
import { Popover } from "@headlessui/react"
import AddNoteButton from "./add-note-button"
import { FaEllipsisH } from "react-icons/fa"
import { LDP, RDF, SCHEMA_INRUPT } from "@inrupt/vocab-common-rdf"
import { useSession } from "@inrupt/solid-ui-react"
import NoteDatasetItem from "./note-thing-dropdown"
import OptionsMenu from "./options-menu"
import Dropdown from "./dropdown"
import useSWR from 'swr'
import { RectangleSkeleton } from "../skeletons"
import { useSolidDataset, useSolidDatasetWithAcl } from "@/app/lib/hooks"
import { SelectedNoteContext } from "@/app/context-providers"
import NoteDatasetLoader from "./note-dataset-loader"

export default function NoteThingDropdown(props: {
    noteThing: Thing,
    datasetIRI: string,
}) {
    const [showChildren, setShowChildren] = useState(false)
    const { data, isValidating } = useSolidDatasetWithAcl(props.datasetIRI)

    const handleOpenDropdown = () => setShowChildren(!showChildren)

    const handleAddChildNote = async () => {
        // update useSWR cache
    }
    const { setSelectedNoteUrl } = useContext(SelectedNoteContext)
    if (!setSelectedNoteUrl) throw new Error("Selected Note Context Required")

    return (
        <div className="flex flex-col">
            <div className="flex justify-between hover:bg-gray-100 w-full rounded px-2 " >
                <div className="flex overflow-clip">
                    <Dropdown.Button isOpen={showChildren} handleToggleDropdown={handleOpenDropdown} />
                    <p
                        className="text-clip sm:truncate"
                        onClick={() => setSelectedNoteUrl(props.datasetIRI)}
                    >
                        {getStringNoLocale(props.noteThing, SCHEMA_INRUPT.name)}
                    </p>
                </div>
                <OptionsMenu>
                    <button onClick={handleAddChildNote}>Add Child Note</button>
                </OptionsMenu>
            </div>
            <Dropdown.Body
                isOpen={showChildren} showLinedrop padding
                isValidating={isValidating}
            >
                {getIriAll(props.noteThing, SCHEMA.hasPart)
                    .map((partDatasetIRI) =>
                        <NoteDatasetLoader noteIri={partDatasetIRI} key={partDatasetIRI}/>
                    )
                }
            </Dropdown.Body>
        </div>
    )
}
