import { getProfileAll, getSolidDatasetWithAcl, getThing, getThingAll, getUrl } from "@inrupt/solid-client";

/**
 * 
 * @param url container's url 
 * @returns postfix of url
 */
export function getContainerUrlPostfix(url: string){
    // cut trailing '/'
    let startindex = url.length-1;
    // decrement startindex until url[startindex] is a '/'
    while (startindex > 0 && url[startindex] !== '/') -- startindex
    return url.substring(startindex)
}

// ontology shortcut
export const NoteDigitalDocument = "https://schema.org/NoteDigitalDocument"

/**
 * Fetches rootContainer of the resource at url, according to the solid specification
 * Purpose is to find the rootStorage for a webID without pim:storage predicate in its profile 
 * @param url 
 * @returns 
 */
export async function getRootContainer(url: string){
    var currUrl = url.concat("/") 
    var rootContainerUrl = undefined as undefined | string
    while (currUrl.length > 0 && !rootContainerUrl){
        // Do http request to resource, and fetch the "link rel-type" from the response headers
        try{
            const res = await fetch(currUrl, {
                method: "HEAD", 
            })
            const headers = res.headers

            // Check if a key contains a "link pim:storage; rel=type"
            headers.forEach((value, key) => {
                if (key === "link"){
                    value.split(",").forEach((v) => {
                        const [url, rel] = v.split(";")
                        if (rel.trim() === `rel="type"` && url.trim() === "<http://www.w3.org/ns/pim/space#Storage>"){
                            rootContainerUrl = currUrl
                            return
                        }
                    })
                }
            })
        } catch(e) {
            // swallow errors since it's likely unauthenticated or other error could arise
        }
        // Get parent container url
        currUrl = currUrl.substring(0, currUrl.substring(0,currUrl.length-1).lastIndexOf("/")+1)
    }
    if (!rootContainerUrl) {
        throw new Error("Couldn't find root container")
    }
    return rootContainerUrl
}

/**
 * Get the typeIndexUrl from a ProfileAll
 * Usage: client-side function
 * 
 * @param profile Profile retrieved from @inrupt/solid-client/getProfileAll
 * @param webId WebID corresponding to profile
 * @param typeIndexType Either SOLID.privateTypeIndex or SOLID.publicTypeIndex
 * @returns Url of the typeIndex as specified by typeIndexType; Returns null if url not found
 */
export function getTypeIndexUrl(
    profile: GetProfileAll, 
    webId: string, 
    typeIndexType: string,
){
    var webIdThing = getThing(profile.webIdProfile, webId)
    if (!webIdThing) throw new Error("invalid solid profile")
    // Check if url is in the standard profile
    var typeIndexUrl = getUrl(webIdThing, typeIndexType)

    // Url is not in standard profile, so check if it's in the extended profile
    if (!typeIndexUrl) { 
        profile.altProfileAll.forEach((profileDataset) => {
            getThingAll(profileDataset).forEach((thing) => {
                const url = getUrl(thing, typeIndexType)
                // By solid specification, each profile can only have one private/publictypeIndex
                if (url) typeIndexUrl = url
            })
        })
    }
    return typeIndexUrl
}

// Typescript shortcuts
export type SolidDatasetWithAcl = Awaited<ReturnType<typeof getSolidDatasetWithAcl>>
export type GetProfileAll = Awaited<ReturnType<typeof getProfileAll>>
