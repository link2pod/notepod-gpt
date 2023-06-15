"use client"

import { useSession } from "@inrupt/solid-ui-react";
import EntryDisplay from "./components/entry-display";
import PodBrowser from "./components/pod-browser";
import useGetPods from "./lib/useGetPods";
import { useEffect, useState } from "react";
import Spinner from "./components/spinner";
import { useRouter } from "next/navigation";
import getEntriesDatabase from "./lib/getEntriesDatabase";
import { SolidDataset } from "@inrupt/solid-client";
import NoteDropdown from "./components/note-dropdown";
import EntryEditor from "./components/entry-editor";
import Editor from "./components/editor";
import WebidSelector from "./components/webid-selector";

enum Direction {
  Vertical, Horizontal,
}


export default function Page(){
    /*
    const {session, sessionRequestInProgress} = useSession()
    const {pods, loading: podsLoading, error: podsError} = useGetPods()
    const [selectedPodId, setSelectedPodId] = useState(0)
    const [entriesDB, setEntriesDB] = useState(undefined as undefined | SolidDataset) 
    //const {loading: savingEntry, saveEntry, error: postError } = usePostEntry()
    const router = useRouter()
    
    useEffect(() => { (async () => {
            console.log(pods)
        if (pods.length > 0){
            const entriesDB = await getEntriesDatabase(pods[selectedPodId])
            setEntriesDB(entriesDB)
        }
    })() }, [selectedPodId, pods])
    console.log(podsLoading, pods)

    if (sessionRequestInProgress) return (<>Logging in <Spinner /> </>)
    if (!session.info.isLoggedIn) {
        router.push('/auth')
        return (<>Redirecting to Login <Spinner /></>)
    }
    if (podsLoading) return <>Loading pods <Spinner /></>
    if (podsError) return <>Error: {podsError}</>
    console.log(entriesDB)
*/
    return (<SlideableSeparator 
        leftSection={<SlideableSeparator 
          leftSection={<WebidSelector />}
          rightSection={<NoteDropdown />}
          direction={Direction.Vertical}
        /> }
        rightSection={<Editor />}
        direction={Direction.Horizontal}
    />)
}

const SlideableSeparator = (props: {
    leftSection: React.ReactNode,
    rightSection: React.ReactNode,
    direction: Direction,
}) => {
    return (
      <div className={`flex flex-col ${props.direction === Direction.Horizontal && "md:flex-row"} h-full w-full`}>
        <div className={`bg-base ${props.direction === Direction.Vertical ? "resize-y" : "md:resize-x"} overflow-auto`}>
          {props.leftSection}
        </div>
        <div
            className="top-0 bottom-0 left-0 right-0 bg-gray-300 w-1"
        />
        <div className="grow bg-base">
          {props.rightSection}
        </div>
      </div>
    );
  };
