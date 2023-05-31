import { createSolidDataset, getSolidDataset, getThingAll, saveSolidDatasetAt } from "@inrupt/solid-client";
import { useSession } from "@inrupt/solid-ui-react";
import { useEffect, useState } from "react";

export default function useGetDatabase({podUrl}: {podUrl: string}){
    const {session} = useSession()

    const entriesUrl = `${podUrl}journalEntries`

    const [entries, setEntries]: any = useState()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("");

    useEffect(() => {
        (async () => { try {
            const database = await getSolidDataset(entriesUrl, { fetch: session.fetch })
        
            console.log("Got database:", database)
            setLoading(false)
            if (database){
                const entries = getThingAll(database)
                setEntries(entries)
            }
        } catch(error: any) { 
            console.log("error", error)
            if (typeof error.statusCode === "number" && error.statusCode === 404) {
                // if not found, create a new SolidDataset (i.e., the reading list)
                const savedReadingList = await saveSolidDatasetAt(
                    entriesUrl,
                    createSolidDataset(),
                    { fetch: session.fetch }
                );
                return useGetDatabase({podUrl})
            } else {
                console.error(error.message);
                setError(error.message)
            }
        }})()
    }, [])
    return {entries, loading, error}
}