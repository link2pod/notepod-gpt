import { Thing, getStringNoLocale } from "@inrupt/solid-client"
import { SCHEMA_INRUPT } from "@inrupt/vocab-common-rdf"
import { useState } from "react"

export default function ({saveEntry, entry}: {saveEntry: (text: string) => void, 
entry: Thing}){
    //const debSaveEntry = _.debounce((text, saveEntry) => {saveEntry(text)}, 1000)
    
    const [text, setText] = useState(getStringNoLocale(entry, SCHEMA_INRUPT.text))
    const entryText = text ? text : ""

    return <div className="relative mb-10">
        <textarea 
            className="w-full h-40 p-2 border border-gray-300 rounded"
            value={entryText}
            onChange={(e) => {
                setText(e.target.value)
                //debSaveEntry(e.target.value, saveEntry)
            }}
        />
        <button className="absolute w-20 bottom-4 right-2" onClick={() => saveEntry(entryText)}>Save</button>
    </div>
}
