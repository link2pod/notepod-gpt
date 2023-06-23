"use client"

import { NoteDigitalDocument } from "@/app/lib/utilities"
import { buildThing, createSolidDataset, createThing, getSolidDatasetWithAcl, getThing, saveSolidDatasetAt, setThing } from "@inrupt/solid-client"
import { useSession } from "@inrupt/solid-ui-react"
import { RDF, SCHEMA_INRUPT } from "@inrupt/vocab-common-rdf"
import { useState } from "react"

export default function AddNoteButton(props: {
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
            .addIri(RDF.type, NoteDigitalDocument)
            .addStringNoLocale(SCHEMA_INRUPT.text, "")
            .build()
        // add thing to dataset 
        const newNoteDataset = setThing(createSolidDataset(), newNoteThing)
        // save dataset
        const res = await saveSolidDatasetAt(newNoteDatasetUrl, newNoteDataset, {fetch: session.fetch})
        console.log(res)
        // create thing 
        // add thing to dataset 
        // save dataset
        // add dataset to typeIndex
        // re-render parent
    }

    return (<button onClick={handleAdd}>Add Note</button>)
}
