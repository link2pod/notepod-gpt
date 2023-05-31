'use client'

import * as SUR from "@inrupt/solid-ui-react";
import { ReactNode, createContext, useState, Dispatch, SetStateAction} from "react";

export function SessionProvider({ children } : {children: ReactNode}) {
  return (
    <SUR.SessionProvider sessionId="app-session">
      {children}
    </SUR.SessionProvider>
  );
};

const UOS = undefined as string | undefined

export const SolidContext = createContext({
    selectedPodUrl: UOS,
    setSelectedPodUrl: undefined as Dispatch<SetStateAction<string | undefined>> | undefined,
})

export function SolidContextProvider({children}: {children: ReactNode}){
  const [selectedPodUrl, setSelectedPodUrl] = useState(UOS)
  return (<SolidContext.Provider value={{selectedPodUrl, setSelectedPodUrl}}>
    {children}
  </SolidContext.Provider>)
}

export const GPTContext = createContext({
  token: UOS,
  //setToken: useState(UOS)[1],
})
