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
        leftSection={<NoteDropdown />}
        rightSection={<Editor />}
    />)
}

const SlideableSeparator = (props: {
    leftSection: React.ReactNode,
    rightSection: React.ReactNode,
}) => {
    const [separatorPosition, setSeparatorPosition] = useState(50);
  
    const handleSeparatorDrag = (e) => {
      const containerWidth = e.target.parentNode.offsetWidth;
      const separatorPosition = Math.max(0, Math.min(e.clientX / containerWidth * 100, 100));
      setSeparatorPosition(separatorPosition);
    };
  
    return (
      <div className="flex h-full">
        <div className="w-1/2 h-full bg-gray-200">
          {props.leftSection}
        </div>
        <div className="relative w-1/2 h-full bg-gray-200">
          {props.rightSection}
          <div
            className="absolute top-0 bottom-0 left-0 right-0 bg-gray-300 cursor-col-resize"
            style={{ left: `${separatorPosition}%` }}
            draggable="true"
            onDrag={handleSeparatorDrag}
          />
        </div>
      </div>
    );
  };
