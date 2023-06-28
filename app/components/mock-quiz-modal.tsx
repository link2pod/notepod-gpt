"use client"

import Spinner from "@/app/components/spinner"
import { SelectedNoteContext } from "@/app/context-providers"
import { getSolidDataset, getStringNoLocale, getThingAll } from "@inrupt/solid-client"
import { useSession } from "@inrupt/solid-ui-react"
import { SCHEMA_INRUPT } from "@inrupt/vocab-common-rdf"
import { useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation";
import BaseModal from "./base-modal";

export default function MockQuizModal(props: {
  isOpen: boolean, 
  setIsOpen: (e: boolean) => any, 
}){
  const {selectedNoteUrl}  // Currently selected note's url
    = useContext(SelectedNoteContext) 
  const [loading, setLoading] = useState(true) // Whether data is being fetched
  const [quizText, setQuizText] = useState("") // Mock quiz text
  const {session} = useSession() // session.fetch needed for authenticated fetch

  // Fetch note data whenever the selectedNoteUrl changes
  useEffect (() => {(async () => {
    setLoading(true)
    if (selectedNoteUrl) {
      const noteDataset 
        = await getSolidDataset(selectedNoteUrl, {fetch: session.fetch})
      const noteThings = getThingAll(noteDataset) // get all Notedigitaldocument things
      
      // concat all note text from things int eh dataset
      const noteText = noteThings
        .map((noteThing) => {
          const s = getStringNoLocale(noteThing, SCHEMA_INRUPT.text)
          console.log(s)
          return s ? s : ""
        })
        .reduce((prev, curr) => prev.concat(curr))
      console.log(noteText, noteDataset, noteThings) //debug
        // generate mockquiz from the server-side api endpoint
        /*
      const quiz = await fetch("/api/mockquiz", {
        method: "POST", 
        body: JSON.stringify({
          noteText // pass in the concatenated note text
        })
      })

      // Empty note text
      if (quiz.status === 500) {
        setQuizText("Error: no note text ")
      }

      const quizJson = await quiz.json()
      const quizText = quizJson.choices[0].message.content
      setQuizText(quizText)
      */
      setQuizText(`My name is \n you are \n\nAnswers:\n yes\nno`)
    }
    setLoading(false)

  })()}, [selectedNoteUrl])

  return (<BaseModal
    {...props}
    title="Mock Quiz"
  >
  {loading ? <Spinner />  : 
    <div className="w-full p-1">{<QuizDisplay text={quizText}/>}</div>
  }
  </BaseModal>)
}

function QuizDisplay(props: {text: string}){
  return (<>
    {props.text.split('\n').map((s) => 
      s === "" ? <hr className="border border-gray-200"/> : <p>{s}</p>)}
  </>)
}
