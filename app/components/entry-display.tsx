"use client"

import { SolidDataset, buildThing, getStringNoLocale, getThingAll, setDatetime, setStringNoLocale, setThing } from "@inrupt/solid-client";
import { SCHEMA_INRUPT } from "@inrupt/vocab-common-rdf";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import _ from "lodash";
import EntryEditor from "./entry-editor";
import postEntry from "../lib/postEntry";
import { getDatabaseIRI } from "../lib/getEntriesDatabase";

export default function ({entriesDB, podUrl, setEntriesDB}: {
    entriesDB: SolidDataset | undefined, 
    podUrl: string,
    setEntriesDB: Dispatch<SetStateAction<SolidDataset | undefined>>,
}){
    if (!entriesDB) return <>loading entries</>
    const entries = getThingAll(entriesDB)
    console.log(entries)
    //const [activeEntry, setActiveEntry] = useState(undefined as undefined | number)
    
    return (<div className="grid">
        {entries.map((entry, index) => {
            return <EntryEditor 
                entry={entry}
                saveEntry={(text) => {
                    const newEntry = 
                        setDatetime(
                        setStringNoLocale(entry, SCHEMA_INRUPT.text, text)
                        , SCHEMA_INRUPT.dateModified, new Date()
                    )

                    postEntry(entriesDB, newEntry, getDatabaseIRI(podUrl))?.then(
                        (newDB) => {setEntriesDB(newDB)}
                    )
                }}
            />
        })}
        <button onClick={ () => { 
            const newEntry = buildThing({name: `note${entries.length+1}`}) 
                .addStringNoLocale(SCHEMA_INRUPT.text, "") 
                .addDatetime(SCHEMA_INRUPT.startDate, new Date())
                .build()
            postEntry(entriesDB, newEntry, getDatabaseIRI(podUrl))?.then(
                (newDB) => {setEntriesDB(newDB)}
            )
        }}>Add Note</button>
    </div>)
}
