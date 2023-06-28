'use client'

import * as SUR from "@inrupt/solid-ui-react";
import { ReactNode, createContext, useState, Dispatch, SetStateAction} from "react";

export function SessionProvider({ children } : {children: ReactNode}) {
      //onSessionRestore={(url) => { router.push('/') }}>
  return (
    <SUR.SessionProvider 
      sessionId="app-session" 
      restorePreviousSession={true} 
    >
      {children}
    </SUR.SessionProvider>
  );
};

const UOS = undefined as string | undefined

export const SelectedNoteContext = createContext({
    selectedNoteUrl: UOS,
    setSelectedNoteUrl: undefined as Dispatch<SetStateAction<string | undefined>> | undefined,
})

export function SelectedNoteContextProvider({children}: {children: ReactNode}){
  const [selectedNoteUrl, setSelectedNoteUrl] = useState(UOS)
  return (<SelectedNoteContext.Provider value={{selectedNoteUrl, setSelectedNoteUrl}}>
    {children}
  </SelectedNoteContext.Provider>)
}

export const GPTContext = createContext({
  token: UOS,
  //setToken: useState(UOS)[1],
})
