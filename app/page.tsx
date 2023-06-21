"use client"

import { useSession } from "@inrupt/solid-ui-react";
import EntryDisplay from "./components/entry-display";
import PodBrowser from "./components/pod-browser";
import useGetPods from "./lib/useGetPods";
import { useEffect, useState } from "react";
import Spinner from "./components/spinner";
import { useRouter } from "next/navigation";
import getEntriesDatabase from "./lib/getEntriesDatabase";
import { SolidDataset } from "@inrupt/solid-client";
import NoteDropdown from "./components/note-container-dropdown";
import EntryEditor from "./components/entry-editor";
import Editor from "./components/editor";
import WebidNoteDropdown from "./components/webid-note-dropdown";

enum Direction {
  Vertical, Horizontal,
}


export default function Page(){
    const {session} = useSession()
    const savedWebIds = [session.info.webId, 
      "http://localhost:8001/test/profile/card#me"
    ] 

    return (<SlideableSeparator 
        leftSection={<div className="grid grid-cols-1 w-full border-b-2 md:border-none">
          {savedWebIds.map((webId) => {
            return webId ? 
              <div><WebidNoteDropdown webId={webId}/></div>
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
        <div className={`bg-base ${props.direction === Direction.Vertical ? "resize-y" : "md:resize-x"} overflow-auto`}>
          {props.leftSection}
        </div>
        <div
            className="top-0 bottom-0 left-0 right-0 bg-gray-300 w-1"
        />
        <div className="grow bg-base">
          {props.rightSection}
        </div>
      </div>
    );
  };
