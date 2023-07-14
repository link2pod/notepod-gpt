"use client"

import Spinner from "@/app/components/spinner"
import { SelectedNoteContext } from "@/app/context-providers"
import { SolidDataset, getSolidDataset, getStringNoLocale, getThingAll } from "@inrupt/solid-client"
import { SCHEMA_INRUPT } from "@inrupt/vocab-common-rdf"
import { useContext, useEffect, useState } from "react"
import BaseModal from "./base-modal";
import useSWR from 'swr'
import { useSolidDatasetWithAcl } from "../lib/hooks"
import { SolidDatasetWithAcl } from "../lib/utilities"

// Displays modal that when active on Dom, will: 
//   - fetch the SolidDataset from the selectedNoteUrl in SelectedNoteContext
//   - Concatenate all Schema:text predicates from all things in the dataset
//   - Use the concated string to query OpenAI Chat completions endpoint to generate mock quiz
//   - Display OpenAI's data in the modal 
export default function MockQuizModal(props: {
  isOpen: boolean,
  setIsOpen: (e: boolean) => any,
}) {
  const { selectedNoteUrl }  // Currently selected note's url
    = useContext(SelectedNoteContext)

  // get note dataset (should be from cache)
  const { data: noteDataset, isLoading: loadingNoteData }
    = useSWR<SolidDatasetWithAcl>(selectedNoteUrl ? selectedNoteUrl : null)

  // Function that calls /api/mockquiz endpoint with required data
  const getMockQuiz = async () => {
    if (selectedNoteUrl && noteDataset) {
      // get all Notedigitaldocument things
      const noteThings = getThingAll(noteDataset)

      // concat all note text from things int eh dataset
      const noteText = noteThings
        .map((noteThing) => {
          const s = getStringNoLocale(noteThing, SCHEMA_INRUPT.text)
          console.log(s)
          return s ? s : ""
        })
        .reduce((prev, curr) => prev.concat(curr))
      console.log(selectedNoteUrl, noteText, noteDataset, noteThings) //debug
      // generate mockquiz from the server-side api endpoint
      const quiz = await fetch("/api/mockquiz", {
        method: "POST",
        body: JSON.stringify({
          noteText // pass in the concatenated note text
        })
      })

      // Empty note text
      if (quiz.status === 500) {
        return "Error: empty note text "
      }

      const quizJson = await quiz.json()
      const quizText = quizJson.choices[0].message.content
      return `Quiz results for ${selectedNoteUrl}\n\n${quizText}`
      // Debugging text to reduce openAI query
      //setQuizText(`Questions\nSample text to reduce openAI api key fees\n\nAnswers:\ntrue\n`) 
    }
  }

  // Send noteData to openAI api only if the modal is open and notedata exists
  const { data: quizText, isLoading: loadingQuiz, mutate, isValidating } = useSWR(
    // Use "/api/mockquiz/$url" as cache key so that each noteurl has cached quiz
    (props.isOpen && noteDataset) ? `/api/mockquiz/${selectedNoteUrl}` : null,
    getMockQuiz,
    {
      // Prevent revalidations on fetching mockquiz data since api is expensive
      revalidateOnMount: false,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      //keepPreviousData: true, //show previous when key changes
    }
  )

  // Display skeleton when loading data/quiz
  const loading = loadingNoteData || loadingQuiz


  return (<BaseModal
    {...props}
    title="Mock Quiz"
  >
    <div className="container w-full h-full max-h-full p-1">
      {/**Quiz contents */}
      {(loading || isValidating) ? <Spinner /> : (!selectedNoteUrl) ? "No note selected"
        : quizText && <QuizDisplay text={quizText} />
      }

      {/**Button to regenerate mock quiz */}
    </div>
    <div className="absolute bottom-0 mb-2 right-0 mr-2">
      <button onClick={() => mutate()}>Regenerate Quiz</button>
    </div>
  </BaseModal>)
}

/**
 * 
 * @param props.text A text string containing mock-quiz data.
 * Should contain sentences seperated by '\n' characters
 * @returns react fragment with each sentence in text wrapped with a <p></p>. 
 * End of sentences are denoted by '\n' characters in text. 
 * Blank lines will be mapped to an <hr /> element.
 */

function QuizDisplay(props: { text: string }) {
  return (<>
    {props.text.split('\n').map((s, id) =>
      s === "" ?
        <hr className="border border-gray-200" key={`mqst${id}`} />
        : <p key={`mqst${id}`}>{s}</p>)}
  </>)
}
