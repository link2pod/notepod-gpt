"use client"

import { SelectedNoteContext } from "@/app/context-providers"
import { AclDataset, SolidDataset, WithAcl, WithResourceInfo, createAcl, getResourceAcl, getSolidDatasetWithAcl, getStringNoLocale, getThingAll, saveAclFor, saveSolidDatasetAt, setStringNoLocale, setThing } from "@inrupt/solid-client"
import { useSession } from "@inrupt/solid-ui-react"
import { SCHEMA_INRUPT } from "@inrupt/vocab-common-rdf"
import { ChangeEvent, useCallback, useContext, useEffect, useState } from "react"
import Spinner from "../spinner"
import _ from "lodash"
import { BsFullscreen, BsShareFill } from "react-icons/bs"
import ShareModal from "../share-modal"
import { time } from "console"
import { generateMockQuiz } from "@/app/lib/utilities"
import MockQuizModal from "../mock-quiz-modal"


export default function Editor(){
    const {selectedNoteUrl} = useContext(SelectedNoteContext)
    const {session} = useSession()
    const [loading, setLoading] = useState(true)
    const [savingStatus, setSavingStatus] = useState("")
    const [noteDataset, setNoteDataset] = useState(undefined as undefined 
        | Awaited<ReturnType<typeof getSolidDatasetWithAcl>>)
    const [showShareModal, setShowShareModal] = useState(false)
    const [showMockQuizModal, setShowMockQuizModal] = useState(false)
    const debouncedSaveNoteDataset = useCallback(
        _.debounce(async (noteDataset: SolidDataset) => {
            if (selectedNoteUrl) {
                try{
                    await saveSolidDatasetAt(selectedNoteUrl, noteDataset, {
                        fetch: session.fetch
                    })
                } catch(e) {console.error(e)}
                setSavingStatus("saved")
            }
        }, 2000)
    , [selectedNoteUrl])

    useEffect(() => { (async ()=>{
        if (selectedNoteUrl){
            setLoading(true)
            const dataset = await getSolidDatasetWithAcl(selectedNoteUrl, {fetch: session.fetch})
            setNoteDataset(dataset)
            setLoading(false)
        }
    })() }, [selectedNoteUrl, session.fetch])

    if (!selectedNoteUrl) return (<div className="w-full flex justify-center pt-2">
        No note selected
    </div>)

    return (<div className="relative w-full h-full flex flex-col overflow-y-auto">
        {/**Toolbar at top*/}
        <div className="w-full justify-between flex sticky top-0 p-2 border-b-2 space-x-1">
            <p className="text-gray-200 md:w-20">{savingStatus}</p>
            <p className="text-primary truncate flex-initial">{selectedNoteUrl}</p>
            <div className="flex justify-evenly space-x-2">
                {noteDataset && <BsShareFill className="hover:fill-primary hover:cursor-pointer" onClick={(e) => {
                    setShowShareModal(true)
                }}/>}
                <BsFullscreen className="hover:fill-primary hover:cursor-pointer"/>
                <div onClick={() => {setShowMockQuizModal(true)}}>Mock Quiz</div>
            </div>
        </div>
        {/**Main editor */}
        <div className="w-full h-full overflow-y-auto">
            {loading? <Spinner />: noteDataset && getThingAll(noteDataset).map((noteThing) => {
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
                        onChange={(e) => {
                            const newNoteThing = setStringNoLocale(
                                noteThing, SCHEMA_INRUPT.text, e.target.value)
                            const newNoteDataset = setThing(noteDataset, newNoteThing)
                            setNoteDataset(newNoteDataset)
                            setSavingStatus("saving")
                            debouncedSaveNoteDataset(newNoteDataset)
                        }}
                    />
                </div>
            })}
        </div>
        {noteDataset && <><ShareModal 
            dataset={noteDataset}
            isOpen={showShareModal}
            setIsOpen={setShowShareModal}
        /> <MockQuizModal 
            selectedNoteUrl={selectedNoteUrl}
            isOpen={showMockQuizModal}
            setIsOpen={setShowMockQuizModal}
        /></>}
    </div>)
}
