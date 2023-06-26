"use client"

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { generateMockQuiz } from "../lib/utilities";
import BaseModal from "./base-modal";
import Spinner from "./spinner";

export default function MockQuizModal(props: {
  isOpen: boolean, 
  setIsOpen: Dispatch<SetStateAction<boolean>>,
  selectedNoteUrl: string,
}){
  const [quizText, setQuizText] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => { (async()=>{
    setLoading(true);
    const quiz = await generateMockQuiz(props.selectedNoteUrl)
    setQuizText(quiz)
    setLoading(false);
  })()
  }, [props.selectedNoteUrl])
  
  return (<BaseModal
    {...props}
    title="Mock Quiz"
  >
    {loading ? <Spinner /> : 
      <div className="w-full p1">
        {quizText}
      </div>}
  </BaseModal>)
}
