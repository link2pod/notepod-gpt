import { createSolidDataset, getSolidDataset, getThingAll, saveSolidDatasetAt } from "@inrupt/solid-client";
import { useSession } from "@inrupt/solid-ui-react";
import { useContext, useEffect, useState } from "react";
import useGetDatabaseIRI from "./useGetDatabaseIRI";

export default function useGetEntriesDatabase(){
    const {session} = useSession()
    const [entriesDB, setEntriesDB] = useState(createSolidDataset())
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(undefined as undefined|string);
    const entriesUrl = useGetDatabaseIRI()
    
    const queryDB = async () => { 
        setLoading(true); 
        setError(undefined)
        if (!entriesUrl) {
            setError("No database url")
        } else { try {
            const database = await getSolidDataset(entriesUrl, { fetch: session.fetch })
            setEntriesDB(database)
        } catch(error: any) { 
            if (typeof error.statusCode === "number" && error.statusCode === 404) {
                // if not found, create a new SolidDataset (i.e., the reading list)
                const savedReadingList = await saveSolidDatasetAt(
                    entriesUrl,
                    createSolidDataset(),
                    { fetch: session.fetch }
                );
                await queryDB()
            } else {
                console.error(error.message);
                setError(error.message)
            }
        }}
        setLoading(false)
    }

    useEffect(() => { queryDB() }, [entriesUrl])
    return {entriesDB, loading, error, refetch: queryDB}
}