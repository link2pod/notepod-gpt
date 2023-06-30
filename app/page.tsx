"use client"

import { useSession } from "@inrupt/solid-ui-react";
import Editor from "./components/editor/editor";
import WebidNoteDropdown from "./components/browser/webid-note-dropdown";
import { useContext, useEffect } from "react";
import { RectangleSkeleton } from "./components/skeletons";
import Spinner from "./components/spinner";

enum Direction {
  Vertical, Horizontal,
}


export default function Page(){
    const {session, sessionRequestInProgress} = useSession()
    useEffect (() => {if (sessionRequestInProgress) {
      console.log("session requiest in progress")
    }}, [sessionRequestInProgress])
    const savedWebIds = [session.info.webId,] 

    return (<SlideableSeparator 
        leftSection={<div className="grid grid-cols-1 w-full h-full border-b-2 md:border-none overflow-auto space-y-1">
          { // skeleton section if logging in. 
          sessionRequestInProgress && <div className="w-full h-6">
            <RectangleSkeleton>
              Loading User Profile <Spinner />
            </RectangleSkeleton> 
          </div>}
          { // display webIds as dropdowns
          savedWebIds.map((webId) => {
            return webId ? 
              <div key={webId}><WebidNoteDropdown webId={webId}/></div>
              : null
          })}
          {/** TODO: Button to open user-inputted webID/folder/noteDataset */}

        </div>}
        rightSection={<Editor />}
        direction={Direction.Horizontal}
    />)
}

/**
 * Creates 2 sections with readjustable separator. 
 * Left-right by default, but can also do up-down 
 * @param props.leftSection Content to display on left
 * @param props.rightSection Content to display on right
 * @param props.direction either Direction.Vertical or Direction.Horizontal
 */
const SlideableSeparator = (props: {
    leftSection: React.ReactNode,
    rightSection: React.ReactNode,
    direction: Direction,
}) => {
    return (
      <div className={`flex flex-col ${props.direction === Direction.Horizontal && "md:flex-row"} h-full w-full`}>
        <div className={`bg-base overflow-y-auto ${props.direction === Direction.Vertical ? "resize-y" : "md:resize-x"}`}>
          <div className='w-40'/> {/** Placeholder for empty content */}
          {props.leftSection}
        </div>
        <div className="border border-gray-200" />
        <div className="bg-base grow overflow-auto">
          {props.rightSection}
        </div>
      </div>
    );
  };

  /**
function Skeleton(){
  return (<div className="w-full h-full flex flex-col space-y-1 p-4">
    <div className="flex-initial h-6"><RectangleSkeleton /></div>
    <div className="flex-auto h-6"><RectangleSkeleton /></div>
  </div>)
}
   */
