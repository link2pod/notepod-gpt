import {
  buildThing,
  createThing,
  setThing,
  saveSolidDatasetAt,
  addDatetime,
  addStringEnglish,
  getStringEnglish,
  setDatetime,
  setStringNoLocale,
} from "@inrupt/solid-client";
import { SCHEMA_INRUPT } from "@inrupt/vocab-common-rdf";
import useGetDatabase from "./useGetEntriesDatabase";
import { useEffect, useState } from "react";
import { getEntryName, getIsoDate } from "./utilities";
import { useSession } from "@inrupt/solid-ui-react";
import useGetDatabaseIRI from "./useGetDatabaseIRI";
import useGetTodayEntry from "./useGetTodayEntry";

export default function usePostEntry(){
  const {
    entriesDB: getDatabaseEntriesDB, 
    loading: getDatabaseLoading, 
    error: getDatabaseError,
    refetch,
  } = useGetDatabase()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(getDatabaseError)
  const [entriesDB, setEntriesDB] = useState(getDatabaseEntriesDB)
  const databaseIRI = useGetDatabaseIRI()
  const {session} = useSession()
  var currEntry = useGetTodayEntry(entriesDB)

  const save = async (entryText: string) => {
    setLoading(true)
    setError(undefined)
    await refetch()
    console.log(databaseIRI, getDatabaseLoading, getDatabaseError, entryText, entriesDB)
    if (!databaseIRI) {setError("No pod url")}
    else if (getDatabaseError){
      setError(getDatabaseError)
    } else {
      const currTime = new Date()
      console.log(currEntry)
      if (!currEntry){
        currEntry = buildThing(createThing({name: getEntryName()}))
          .addDate(SCHEMA_INRUPT.startDate, new Date())
          .build()
      } 
      currEntry = setDatetime(currEntry, SCHEMA_INRUPT.dateModified, currTime)
      currEntry = setStringNoLocale(currEntry,SCHEMA_INRUPT.text,entryText)
      const updatedEntriesDB = setThing(entriesDB, currEntry)
      try{
        const savedEntriesDB = await saveSolidDatasetAt(
          databaseIRI, updatedEntriesDB, {fetch: session.fetch}
        )
        console.log(savedEntriesDB, currEntry)
        setEntriesDB(savedEntriesDB)
      } catch (err: any){
        setError(err.toString())
      }
    } 
    setLoading(false)
  }

  return {entriesDB, loading, error, saveEntry: save}
}
