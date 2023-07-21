import { SolidDataset, ThingPersisted, buildThing, createContainerInContainer, createSolidDataset, createThing, getIri, getIriAll, getProfileAll, getSolidDataset, getSolidDatasetWithAcl, getSourceIri, getSourceUrl, getThing, getThingAll, getUrl, saveSolidDatasetAt, setThing } from "@inrupt/solid-client";
import { Session, getDefaultSession } from "@inrupt/solid-client-authn-browser";
import { LDP, RDF, SCHEMA_INRUPT } from "@inrupt/vocab-common-rdf";
import { SOLID } from "@inrupt/vocab-solid";

/**
 * 
 * @param url container's url 
 * @returns postfix of url
 */
export function getContainerUrlPostfix(url: string) {
    // cut trailing '/'
    let startindex = url.length - 1;
    // decrement startindex until url[startindex] is a '/'
    while (startindex > 0 && url[startindex] !== '/') --startindex
    return url.substring(startindex)
}

/**
 * 
 * @param url url of resource or container
 * @returns container of a resource. If url represents container, returns parent container
 */
export function getUrlPrefix(url: string){
    return url.substring(0, url.substring(0, url.length - 1).lastIndexOf("/") + 1)
}

// ontology shortcut
export const SCHEMA = {
    NoteDigitalDocument: "https://schema.org/NoteDigitalDocument",
    isPartOf: "https://schema.org/isPartOf",
    hasPart: "https://schema.org/hasPart",
}

/**
 * Fetches rootContainer of the resource at url, according to the solid specification
 * Purpose is to find the rootStorage for a webID without pim:storage predicate in its profile 
 * @param url 
 * @returns 
 */
export async function getRootContainer(url: string) {
    var currUrl = url.concat("/")
    var rootContainerUrl = undefined as undefined | string
    while (currUrl.length > 0 && !rootContainerUrl) {
        // Do http request to resource, and fetch the "link rel-type" from the response headers
        try {
            const res = await fetch(currUrl, {
                method: "HEAD",
            })
            const headers = res.headers

            // Check if a key contains a "link pim:storage; rel=type"
            headers.forEach((value, key) => {
                if (key === "link") {
                    value.split(",").forEach((v) => {
                        const [url, rel] = v.split(";")
                        if (rel.trim() === `rel="type"` && url.trim() === "<http://www.w3.org/ns/pim/space#Storage>") {
                            rootContainerUrl = currUrl
                            return
                        }
                    })
                }
            })
        } catch (e) {
            // swallow errors since it's likely unauthenticated or other error could arise
        }
        // Get parent container url
        currUrl = getUrlPrefix(currUrl)
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
) {
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

const getFetch = () => getDefaultSession().fetch

// Typescript shortcuts
export type SolidDatasetWithAcl = Awaited<ReturnType<typeof getSolidDatasetWithAcl>>
export type GetProfileAll = Awaited<ReturnType<typeof getProfileAll>>
export type Fetch = ReturnType<typeof getFetch>

/**
 * @param containerIri 
 * @param level 
 * @param func 
 * @returns 
 */
export async function forEachNoteInContainer(
    containerIri: string, level: number, func: (containerIri: string) => any,
    fetch?: Fetch,
) {
    if (level <= 0) return
    const containerDataset = await getSolidDataset(containerIri, { fetch })
    const res = await Promise.all(getIriAll(
        getThing(containerDataset, containerIri) as ThingPersisted,
        LDP.contains,
    ).map((noteThingIri) => {
        const noteThing = getThing(containerDataset, noteThingIri)
        if (!noteThing) { return null } // noteThing is empty 
        if (getIriAll(noteThing, RDF.type).find((typeIri) => {
            return typeIri === LDP.Container
        })) {
            // noteThingIri corresponds to a container
            return forEachNoteInContainer(noteThingIri, level - 1, func, fetch)
        }
        // else, noteThingIri corresponds to a dataset
        func(noteThingIri)
        return null
    }))
}

/**
 * 
 * Create a container in parent, with dataset for note information
 * Each note has it's container, and dataset storing a single Thing of type Schema:noteDigitalDocument
 * The Thing will have its schema: isPartOf, name, text, etc. as relevant
 * @param containerIRI parent container IRI to store new note in
 * @param session session with a fetch function
 * @param parentNoteIRI IRI of parent note (i.e. create a child note of the parent)
 * @returns A promise resolving to the saved dataset, rejecting if failed. See also: https://docs.inrupt.com/developer-tools/api/javascript/solid-client/modules/resource_solidDataset.html#savesoliddatasetat
 */
export async function addNoteToContainer(containerIRI: string, fetch?: Fetch, parentNoteIRI?: string) {
    try {
        const authfetch = fetch ? fetch : getDefaultSession().fetch

        const dateString = (new Date()).toISOString()
            .replaceAll(":","-") // DPOP issues


        const newContainerIRI = `${containerIRI}${dateString}/`
        const newNoteDatasetUrl = `${newContainerIRI}note-dataset`

        // create new note Thing 
        var newNoteThing = buildThing(createThing())
            .addIri(RDF.type, SCHEMA.NoteDigitalDocument)
            .addStringNoLocale(SCHEMA_INRUPT.name, dateString)
            .addStringNoLocale(SCHEMA_INRUPT.text, "")

        if (parentNoteIRI) {
            newNoteThing = newNoteThing.addIri(SCHEMA.isPartOf, parentNoteIRI)
        }

        // add thing to dataset 
        const newNoteDataset = setThing(createSolidDataset(), newNoteThing.build())
        // save dataset
        console.log(newNoteThing, newNoteDataset, authfetch)
        const res = await saveSolidDatasetAt(newNoteDatasetUrl, newNoteDataset, { fetch: getDefaultSession().fetch })
        console.log(res)
        return res;
    } catch (err) {
        console.error(err)
        return Promise.reject(err)
    }
}
