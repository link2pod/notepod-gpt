"use client"

import { useSession } from "@inrupt/solid-ui-react";
import EntryDisplay from "./entry-display";
import PodBrowser from "./pod-browser";
import useGetPods from "../lib/useGetPods";
import { useEffect, useState } from "react";
import Spinner from "../lib/components/spinner";
import { useRouter } from "next/navigation";
import getEntriesDatabase from "../lib/getEntriesDatabase";
import { SolidDataset } from "@inrupt/solid-client";


export default function Page(){
    const {session, sessionRequestInProgress} = useSession()
    const {pods, loading: podsLoading, error: podsError} = useGetPods()
    const [selectedPodUrl, setSelectedPodUrl] = useState("")
    const [entriesDB, setEntriesDB] = useState(undefined as undefined | SolidDataset) 
    //const {loading: savingEntry, saveEntry, error: postError } = usePostEntry()
    const router = useRouter()
    
    useEffect(() => { (async () => {
        try{
            const entriesDB = await getEntriesDatabase(selectedPodUrl)
            setEntriesDB(entriesDB)
        } catch (err){
            console.log(err)
        }
    })() }, [selectedPodUrl, pods])
    console.log(podsLoading, pods)

    if (sessionRequestInProgress) return (<>Logging in <Spinner /> </>)
    if (!session.info.isLoggedIn) {
        router.push('/auth')
        return (<>Redirecting to Login <Spinner /></>)
    }
    if (podsLoading) return <>Loading pods <Spinner /></>
    if (podsError) return <>Error: {podsError}</>
    console.log(entriesDB)

    return (<>
        <label>Pod Url: </label>
        <input type="url" value={selectedPodUrl} onChange={(e) => {
            setSelectedPodUrl(e.target.value)
        }}/>
        <p>Or select a pod: </p>
        <PodBrowser pods={pods} selectedPodUrl={selectedPodUrl} setSelectedPodUrl={setSelectedPodUrl}/>
        <br />
        <EntryDisplay entriesDB={entriesDB} setEntriesDB={setEntriesDB} podUrl={selectedPodUrl} />
    </>)
}
