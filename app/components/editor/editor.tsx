"use client"

import { SelectedNoteContext, ToastContext } from "@/app/context-providers"
import { SolidDataset, ThingPersisted, getAgentAccess, getPublicAccess, getSolidDatasetWithAcl, getStringNoLocale, getThingAll,  saveSolidDatasetAt, setStringNoLocale, setThing } from "@inrupt/solid-client"
import { useSession } from "@inrupt/solid-ui-react"
import { SCHEMA_INRUPT } from "@inrupt/vocab-common-rdf"
import { ChangeEvent, FormEventHandler, useCallback, useContext, useEffect, useState } from "react"
import Spinner from "../spinner"
import _ from "lodash"
import { BsFullscreen, BsShareFill } from "react-icons/bs"
import ShareModal from "../share-modal"
import { useSolidDatasetWithAcl } from "@/app/lib/hooks"
import CircleSpinner from "../circle-spinner"

export default function Editor(){
    const {selectedNoteUrl} = useContext(SelectedNoteContext)
    const {session} = useSession()
    const [savingStatus, setSavingStatus] = useState("")
    
    const {data: noteDataset, isLoading, error, mutate, isValidating} 
        = useSolidDatasetWithAcl(selectedNoteUrl ? selectedNoteUrl : null,
            {swrConfig: {
                onSuccess(data, key, config) {
                    setDisplayedNoteDataset(data)
                },
                keepPreviousData: false,
            }}
        )
    
    const [displayedNoteDataset, setDisplayedNoteDataset] 
        = useState(noteDataset)

    // Assume fetched note is more recent, so prefer useSWR's data
    useEffect(() => setDisplayedNoteDataset(noteDataset), [noteDataset])
    
    const [showShareModal, setShowShareModal]  // Sharing note permissions modal
        = useState(false)
    
    const {toast} = useContext(ToastContext) // show toasts
    
    // Create debounced saving function
    const debouncedSaveNoteDataset = useCallback(
        _.debounce(async (noteDataset: SolidDataset) => {
            if (selectedNoteUrl) {
                try{
                    await saveSolidDatasetAt(selectedNoteUrl, noteDataset, {
                        fetch: session.fetch
                    })
                    await mutate()
                    setSavingStatus("saved")
                } catch(e) {
                    console.error(e) 
                    toast(<p>Error</p>)
                    setSavingStatus("Error")
                }
            }
        }, 2000)
    , [selectedNoteUrl])

    const handleInputChange = (text: string, noteThing: ThingPersisted) => {
        if (!displayedNoteDataset){
            // This shouldn't occur, but handle it just in case
            toast("Error loading note. Try refreshing the page.")
            console.error("No dataset")
            return
        }
        // Check if note is publically editable
        const publicAccess = getPublicAccess(displayedNoteDataset)
        if (!publicAccess || !publicAccess.write){
            // No public access, so check private access
            const webId = session.info.webId 
            if (!webId){ // Not logged in 
                // Show toast for not logged in
            } else {
                const access = getAgentAccess(displayedNoteDataset, webId)
                if (!access || !access.write){
                    toast(<>Warning: no private access</>)
                    // no private access, check group access TODO 
                }
            }
        }

        const newNoteThing = setStringNoLocale(
            noteThing, SCHEMA_INRUPT.text, text)
        const newNoteDataset = setThing(displayedNoteDataset, newNoteThing)
        setSavingStatus("saving")
        setDisplayedNoteDataset(newNoteDataset)
        debouncedSaveNoteDataset(newNoteDataset)
    }

    if (!selectedNoteUrl) return (<div className="w-full flex justify-center pt-2">
        No note selected
    </div>)

    return (<div className="relative w-full h-full flex flex-col overflow-y-auto">
        {/**Toolbar at top*/}
        <div className="w-full justify-between flex sticky top-0 p-2 border-b-2 space-x-1">
            {/**Saving status (or whatever it's set to)*/}
                <p className="text-gray-400 md:w-20">
                    {savingStatus}
                </p>
            <div className="flex space-between space-x-1">
                {/**Title of note */}
                <p className="text-primary truncate flex-initial">{selectedNoteUrl}</p>
                {/**Circle Spinner if Revalidating data */}
                {isValidating&& <CircleSpinner className="w-6 h-6"/>}
            </div>
            {/**Div on right of note-title. 
             * Shows sharing icon, fullscreen icon
            */}
            <div className="flex justify-evenly space-x-2">
                {noteDataset && <BsShareFill className="hover:fill-primary hover:cursor-pointer" onClick={(e) => {
                    setShowShareModal(true)
                }}/>}
                <BsFullscreen className="hover:fill-primary hover:cursor-pointer"/>
            </div>
        </div>
        {/**Main editor */}
        <div className="w-full h-full overflow-y-auto">
            {(isLoading )? <Spinner />: displayedNoteDataset && getThingAll(displayedNoteDataset).map((noteThing) => {
                const text = getStringNoLocale(noteThing, SCHEMA_INRUPT.text)
                const url = noteThing.url
                const noteName = url.substring(url.lastIndexOf("#")+1)
                return <div className="flex flex-col w-full" key={url}>
                    <div className="flex w-full items-center justify-center mt-2">
                        <hr className="border border-gray-200 w-1/2 rounded" />
                        <p className="mx-1 text-gray-500 truncate">{noteName}</p>
                        <hr className="border border-gray-200 w-1/2 rounded" />
                    </div>
                    <textarea 
                        className="w-full h-full border border-gray-200"
                        value={text ? text : undefined}
                        onChange={(e) => handleInputChange(e.target.value,noteThing)}
                    />
                </div>
            })}
        </div>
        {noteDataset && <><ShareModal 
            dataset={noteDataset}
            isOpen={showShareModal}
            setIsOpen={setShowShareModal}
        /> 
        </>}
    </div>)
}
