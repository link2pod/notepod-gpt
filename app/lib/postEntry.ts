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
  SolidDataset,
  Thing,
} from "@inrupt/solid-client";
import { getDefaultSession } from "@inrupt/solid-client-authn-browser";

export default async function postEntry(entriesDB: SolidDataset, entry: Thing, entryDBUrl: string){
  const session = getDefaultSession()

    console.log(entryDBUrl, entry, entriesDB)
    if (!session.info.isLoggedIn) {throw new Error("Not logged in")}
      const updatedEntriesDB = setThing(entriesDB, entry)
      try{
        const savedEntriesDB = await saveSolidDatasetAt(
          entryDBUrl, updatedEntriesDB, {fetch: session.fetch}
        )
        console.log(savedEntriesDB)
        return savedEntriesDB
      } catch (err: any){
        console.log(err)
      }
}
