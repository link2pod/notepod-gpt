import { createSolidDataset, getSolidDataset, getThingAll, saveSolidDatasetAt } from "@inrupt/solid-client";
import { getDefaultSession } from "@inrupt/solid-client-authn-browser";

export function getDatabaseIRI(podUrl: string) {
    return `${podUrl}journalEntries.ttl`
}

export default async function getEntriesDatabase(podUrl: string){
    const session = getDefaultSession()
    if (!session.info.isLoggedIn) {
        throw new Error("not logged in")
    }
    const entriesUrl = getDatabaseIRI(podUrl)
    var resultDataset = createSolidDataset()
    
    console.log(entriesUrl, session)
    try {
        resultDataset = await getSolidDataset(entriesUrl, { fetch: session.fetch })
    } catch(error: any) { 
        if (typeof error.statusCode === "number" && error.statusCode === 404) {
            // if not found, create a new SolidDataset (i.e., the reading list)
            resultDataset = await saveSolidDatasetAt(
                entriesUrl,
                createSolidDataset(),
                { fetch: session.fetch }
            );
        } else {
            console.error(error.message);
        }
    }
    return resultDataset
}