"use client"

import Spinner from "@/app/components/spinner"
import { SelectedNoteContext } from "@/app/context-providers"
import { getSolidDataset, getStringNoLocale, getThingAll } from "@inrupt/solid-client"
import { useSession } from "@inrupt/solid-ui-react"
import { SCHEMA_INRUPT } from "@inrupt/vocab-common-rdf"
import { useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation";
import BaseModal from "./base-modal";

// Displays modal that when active on Dom, will: 
//   - fetch the SolidDataset from the selectedNoteUrl in SelectedNoteContext
//   - Concatenate all Schema:text predicates from all things in the dataset
//   - Use the concated string to query OpenAI Chat completions endpoint to generate mock quiz
//   - Display OpenAI's data in the modal 
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
    setLoading(true) // Display loading dots in modal
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
      // Debugging text to reduce openAI query
      //setQuizText(`Questions\nSample text to reduce openAI api key fees\n\nAnswers:\ntrue\n`) 
    }
    setLoading(false) // Remove loading dots in modal 

  })()}, [selectedNoteUrl, session.fetch])

  return (<BaseModal
    {...props}
    title="Mock Quiz"
  >
  {loading ? <Spinner />  : 
    <div className="w-full p-1">{<QuizDisplay text={quizText}/>}</div>
  }
  </BaseModal>)
}

// input: 
// text: string 
//    - an OpenAI generated text string containing mock-quiz data
//    - Will contain sentences seperated by '\n' characters
// output: react fragment with each sentence in text wrapped with a <p></p> 
//    - end of sentences are denoted by '\n' characters in text 
//    - Blank lines will be mapped to an <hr /> element 
function QuizDisplay(props: {text: string}){
  return (<>
    {props.text.split('\n').map((s,id) => 
      s === "" ? 
        <hr className="border border-gray-200" key={`mqst${id}`}/> 
        : <p key={`mqst${id}`}>{s}</p>)}
  </>)
}
