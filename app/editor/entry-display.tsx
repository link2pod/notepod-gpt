"use client"

import { useSession, CombinedDataProvider, Text } from "@inrupt/solid-ui-react";
import { useRouter } from "next/navigation";
import useGetEntriesDatabase from "../lib/useGetEntriesDatabase";
import getTodayEntry from "../lib/useGetTodayEntry";
import usePostEntry from "../lib/usePostEntry";
import { getStringNoLocale } from "@inrupt/solid-client";
import { SCHEMA_INRUPT } from "@inrupt/vocab-common-rdf";
import { useEffect, useState } from "react";
import _ from "lodash";

const debSaveEntry = _.debounce((text, saveEntry) => {saveEntry(text)}, 1000)

export default function (){
    const { session, sessionRequestInProgress } = useSession()
    const router = useRouter()
    const {loading, entriesDB, error, refetch} = useGetEntriesDatabase()
    const {loading: savingEntry, saveEntry, error: postError } = usePostEntry()
    const entry = getTodayEntry(entriesDB)
    const [entryText, setEntryText] = useState("")
    useEffect( () => { if (entry) {
        const text=getStringNoLocale(entry,SCHEMA_INRUPT.text)
        if (text) setEntryText(text)
    }}, [entry])
    console.log(entriesDB, entry, entryText)


    /*if (!session.info.isLoggedIn) {
        router.push('/auth')
        return (<>Redirecting to Login...</>)
    }
    if (sessionRequestInProgress) return (<>"Loading Session..."</>)

    if (error) {return <>Loading Database Error: {error}</>}
    if (loading) return (<>"Loading EntriesDB..."</>)*/

    return (<>
        <textarea 
            className="w-full h-40 p-2 border border-gray-300 rounded"
            value={entryText ? entryText : ""}
            onChange={(e) => {
                setEntryText(e.target.value)
                debSaveEntry(e.target.value, saveEntry)
            }}
        />
        <div className="text-gray-600 mb-2">
            {savingEntry ? "saving..." : "saved"}
        </div>
        <p>{postError && postError}</p>
    </>)
}
