"use client"

import { useSession } from "@inrupt/solid-ui-react";
import Editor from "./components/editor/editor";
import WebidNoteDropdown from "./components/browser/webid-note-dropdown";
import { useContext, useEffect } from "react";
import { ToastContext } from "./context-providers";
import Spinner from "./components/spinner";

enum Direction {
  Vertical, Horizontal,
}


export default function Page(){
    const {session, sessionRequestInProgress} = useSession()
    const {toast} = useContext(ToastContext)
    useEffect (() => {if (sessionRequestInProgress) {
      toast(<>Session Request in Progress <Spinner /></>)
    }}, [sessionRequestInProgress])
    const savedWebIds = [session.info.webId,] 

    return (<SlideableSeparator 
        leftSection={<div className="grid grid-cols-1 w-full border-b-2 md:border-none overflow-auto">
          {savedWebIds.map((webId) => {
            return webId ? 
              <div key={webId}><WebidNoteDropdown webId={webId}/></div>
              : null
          })}
        </div>}
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
        <div className={`bg-base overflow-y-auto ${props.direction === Direction.Vertical ? "resize-y" : "md:resize-x"}`}>
          {props.leftSection}
        </div>
        <div className="border border-gray-200" />
        <div className="bg-base grow overflow-auto">
          {props.rightSection}
        </div>
      </div>
    );
  };
