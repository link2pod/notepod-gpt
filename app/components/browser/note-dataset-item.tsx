"use client"

import { Popover } from "@headlessui/react"
import { getContainerUrlPostfix } from "../../lib/utilities"
import { FaEllipsisH } from "react-icons/fa"
import AddNoteButton from "./add-note-button"
import { useContext } from "react"
import { SelectedNoteContext } from "../../context-providers"
import OptionsMenu from "./options-menu"

export default function NoteDatasetItem(props: {
    noteDatasetUrl: string
}){
    const {setSelectedNoteUrl} = useContext(SelectedNoteContext)
    if (!setSelectedNoteUrl) throw new Error("Selected Note Context Required")

    return (<div 
        className="flex justify-between hover:bg-gray-200 w-full px-2"
        onClick={() => setSelectedNoteUrl(props.noteDatasetUrl)}
    >
        <div className="overflow-clip truncate">
            {getContainerUrlPostfix(props.noteDatasetUrl).substring(1)}
        </div>
        <OptionsMenu>
            <button>Share</button>
        </OptionsMenu>
    </div>)
}
