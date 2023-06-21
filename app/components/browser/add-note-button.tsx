"use client"

import { buildThing, createThing, getSolidDatasetWithAcl, getThing, saveSolidDatasetAt, setThing } from "@inrupt/solid-client"
import { useSession } from "@inrupt/solid-ui-react"
import { useState } from "react"

export default function(props: {
    parentUrl: string, 
}){
    const [active, setActive] = useState(false)
    const {session} = useSession()

    const handleAdd = async () => {
        const parentDataset = await getSolidDatasetWithAcl(props.parentUrl, {fetch: session.fetch})
        
        // create new note Thing 
        var newNoteCnt = 1;
        while (getThing(parentDataset, `${props.parentUrl}new-note-(${newNoteCnt})`)) {
            ++newNoteCnt
        }
        const newNoteDatasetUrl = `${props.parentUrl}new-note-(${newNoteCnt})`
        
        const newNoteThing = buildThing(createThing({name: "section1"}))
            .build()
        // add thing to dataset 
        const newParentDataset = setThing(parentDataset, newNoteThing)
        // save dataset
        const res = await saveSolidDatasetAt(newNoteDatasetUrl, newParentDataset, {fetch: session.fetch})
        console.log(res)
        // create thing 
        // add thing to dataset 
        // save dataset
        // add dataset to typeIndex
        // re-render parent
    }

    return (<button onClick={handleAdd}>Add Note</button>)
}
