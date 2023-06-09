"use client"
import { SolidDataset, getSolidDataset, getSolidDatasetWithAcl } from '@inrupt/solid-client'
import useSWR from 'swr'
import { SolidDatasetWithAcl } from './utilities'
import { getDefaultSession } from '@inrupt/solid-client-authn-browser'

/**
 * Wrapper hook for useSWR that wraps a getSolidDatasetWithAcl call. 
 * Automatically uses getDefaultSession().fetch(), unless otherwise specified
 * @param key useSWR key (first parameter of useSWR)
 * @param options.swrConfig config for useSWR (third parameter of useSWR). 
 * Default value is `{}` (i.e. empty object)
 * @param options.inruptConfig options for getSolidDatasetWithAcl (second parameter). 
 * By default, fetcher will use getDefaultSession()
 * (i.e. currently authenticated session's fetch function)
 * @link https://swr.vercel.app 
 * @returns equivalent to calling `useSWR(key, () => getSolidDatasetWithAcl(key))`
 */
export function useSolidDatasetWithAcl(key: string|null, options?: {
    swrConfig?: Parameters<typeof useSWR<SolidDatasetWithAcl>>[2] 
    inruptConfig?: Parameters<typeof getSolidDatasetWithAcl>[1] 
}){
    const swrConfig = (options &&options.swrConfig) ? options.swrConfig : {}
    const inruptConfig = (options &&options.inruptConfig) ? options.inruptConfig: {
        fetch: getDefaultSession().fetch,
    }
    //console.log(options, inruptConfig)
    return useSWR(
        key, (key) => {
            //console.log("inside withacl fetcher",key, inruptConfig)
            return getSolidDatasetWithAcl(key, inruptConfig)
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
export function useSolidDataset(key: string|null, options?: {
    swrConfig?: useSWRGetDatasetParams[2] 
    inruptConfig?: Parameters<typeof getSolidDataset>[1] 
}){
    const swrConfig = (options &&options.swrConfig) ? options.swrConfig : {}
    const inruptConfig = (options &&options.inruptConfig) ? options.inruptConfig: {
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



