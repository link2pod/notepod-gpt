import { SolidDataset, getThing } from "@inrupt/solid-client"
import { getEntryName } from "./utilities"
import useGetDatabaseIRI from "./useGetDatabaseIRI"

export default function(entriesDB: SolidDataset){
    const currEntryName = getEntryName()
    const databaseIRI = useGetDatabaseIRI()
    console.log(databaseIRI)
    if (!databaseIRI) return undefined
    return getThing(entriesDB, `${databaseIRI}#${currEntryName}`)
}
