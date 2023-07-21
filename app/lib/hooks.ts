"use client"
import { SolidDataset, createSolidDataset, getIri, getIriAll, getSolidDataset, getSolidDatasetWithAcl, getThing, getThingAll } from '@inrupt/solid-client'
import useSWR from 'swr'
import { SCHEMA, SolidDatasetWithAcl, forEachNoteInContainer } from './utilities'
import { Session, getDefaultSession } from '@inrupt/solid-client-authn-browser'
import { SOLID } from '@inrupt/vocab-solid'
import { useEffect, useState } from 'react'

/**
 * Wrapper hook for useSWR that wraps a getSolidDatasetWithAcl call. 
 * Automatically uses getDefaultSession().fetch(), unless otherwise specified
 * @param datasetIRI IRI of dataset to fetch with acl. Dataset won't fetch if null
 * @param options.swrConfig config for useSWR (third parameter of useSWR). 
 * Default value is `{}` (i.e. empty object)
 * @param options.inruptConfig options for getSolidDatasetWithAcl (second parameter). 
 * By default, fetcher will use getDefaultSession()
 * (i.e. currently authenticated session's fetch function)
 * @link https://swr.vercel.app 
 * @returns equivalent to calling `useSWR(datasetIRI+".acl", () => getSolidDatasetWithAcl(datasetIRI))`
 */
export function useSolidDatasetWithAcl(datasetIRI: string | null, options?: {
    swrConfig?: Parameters<typeof useSWR<SolidDatasetWithAcl>>[2]
    inruptConfig?: Parameters<typeof getSolidDatasetWithAcl>[1]
}) {
    const swrConfig = (options && options.swrConfig) ? options.swrConfig : {}
    const inruptConfig = (options && options.inruptConfig) ? options.inruptConfig : {
        fetch: getDefaultSession().fetch,
    }
    const key = datasetIRI ? `${datasetIRI}.acl` : null
    return useSWR(
        key, () => {
            //console.log("inside withacl fetcher",key, inruptConfig)
            if (!datasetIRI) throw Error(`${key}, ${datasetIRI}`) // shouldn't be possible
            return getSolidDatasetWithAcl(datasetIRI, inruptConfig)
        },
        swrConfig)
}

// helper typedef
type useSWRGetDatasetParams
    = Parameters<typeof useSWR<Awaited<ReturnType<typeof getSolidDataset>>>>

/**
 * Wrapper hook for useSWR that wraps a getSolidDataset call. 
 * Automatically uses getDefaultSession().fetch(), unless otherwise specified
 * @param key useSWR key (first parameter of useSWR)
 * @param options.swrConfig config for useSWR (third parameter of useSWR). 
 * Default value is `{}` (i.e. empty object)
 * @param options.inruptConfig options for getSolidDataset (second parameter). 
 * By default, fetcher will use getDefaultSession()
 * (i.e. currently authenticated session's fetch function)
 * @link https://swr.vercel.app 
 * @returns equivalent to calling `useSWR(key, () => getSolidDataset(key))`
 */
export function useSolidDataset(key: string | null, options?: {
    swrConfig?: useSWRGetDatasetParams[2]
    inruptConfig?: Parameters<typeof getSolidDataset>[1]
}) {
    const swrConfig = (options && options.swrConfig) ? options.swrConfig : {}
    const inruptConfig = (options && options.inruptConfig) ? options.inruptConfig : {
        fetch: getDefaultSession().fetch,
    }
    //console.log(options, inruptConfig)
    return useSWR(
        key, (key) => {
            //console.log("inside fetcher",key, inruptConfig)
            return getSolidDataset(key, inruptConfig)
        },
        swrConfig)
}

/**
 * 
 * @param typeIndexDataset Solid Dataset representing typeindex to get notes from
 * @param level max depth to search into (i.e. will recurse into depth-1 containers). Default = 1.
 * E.g.: level = 0 is invalid, level = 1 will give datasets denoted by instanceof, 
 * level = 2 will search datasets 1 container deep
 * @param session authenticated session with fetch function
 * @returns array of noteDataset IRIs
 */
export function useGetNotesFromTypeIndex(typeIndexDataset?: SolidDataset, level = 1, session?: Session) {
    const [result, setResult] = useState(new Set<string>());
    const [size, setSize] = useState(0) // number of notes in result
    const [isLoading, setIsLoading] = useState(true)
    const fetch = session ? session.fetch : getDefaultSession().fetch

    const addToResult = (iri: string) => {
        result.add(iri)
        setSize(result.size) // force re-render
    }

    // go through all typeRegistrations that have a solid:forClass equal to Schema:NoteDigitalDocument
    // Add the iri to result if it's a dataset, otherwise recurse into the container
    useEffect( () =>  {
        setIsLoading(true)
        getThingAll(typeIndexDataset ? typeIndexDataset : createSolidDataset())
        .forEach((thing) => {
            if (getIri(thing, SOLID.forClass) === SCHEMA.NoteDigitalDocument) {
                const instanceContainerIri
                    = getIri(thing, SOLID.instanceContainer)
                const instanceIri
                    = getIri(thing, SOLID.instance)

                if (instanceContainerIri) {
                    forEachNoteInContainer(instanceContainerIri, level - 1, addToResult, fetch)
                } else if (instanceIri) {
                    addToResult(instanceIri)
                }
            }
        })
    }, [typeIndexDataset, fetch, level])
    return {noteIRIs: Array.from(result), isLoading, }
}
