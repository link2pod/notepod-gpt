"use client"

import { useSolidDatasetWithAcl } from "@/app/lib/hooks"
import { SCHEMA } from "@/app/lib/utilities"
import { buildThing, createSolidDataset, createThing, getSolidDatasetWithAcl, getThing, saveSolidDatasetAt, setThing } from "@inrupt/solid-client"
import { useSession } from "@inrupt/solid-ui-react"
import { RDF, SCHEMA_INRUPT } from "@inrupt/vocab-common-rdf"
import { useState } from "react"

export default function AddNoteButton(props: {
    parentUrl: string, 
}){
    const [active, setActive] = useState(false)
    const {session} = useSession()
    // manage data from parentContainerDataset
    const {data: parentDataset, mutate} = useSolidDatasetWithAcl(
        props.parentUrl
    )

    const handleAdd = async () => {
        if (!parentDataset) {
            console.error("Parent Dataset not found. Try again.")
            return
        }
        
        // generate note url (increment number until a unique is found)
        var newNoteCnt = 1;
        while (getThing(parentDataset, `${props.parentUrl}new-note-(${newNoteCnt})`)) {
            ++newNoteCnt
        }
        const newNoteDatasetUrl = `${props.parentUrl}new-note-(${newNoteCnt})`
        
        // create new note Thing 
        const newNoteThing = buildThing(createThing({name: "section1"}))
            .addIri(RDF.type, SCHEMA.NoteDigitalDocument)
            .addStringNoLocale(SCHEMA_INRUPT.text, "")
            .build()
        
        // add thing to dataset 
        const newNoteDataset = setThing(createSolidDataset(), newNoteThing)
        // save dataset
        try{
            await saveSolidDatasetAt(newNoteDatasetUrl, newNoteDataset, {fetch: session.fetch})
        } catch(err){
            console.error(err)
            // TODO: show toast with error
        }
        // re-render parent
        mutate()
    }

    return (<button onClick={handleAdd} disabled={!parentDataset}>Add Note</button>)
}
