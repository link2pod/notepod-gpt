"use client"

import { ChangeEvent, Dispatch, Fragment, MouseEventHandler, SetStateAction, useEffect, useState } from 'react'
import { Combobox, Dialog } from '@headlessui/react'
import { useRouter } from 'next/navigation'
import { Access, AclDataset, AgentAccess, SolidDataset, WithAcl, WithFallbackAcl, WithResourceInfo, createAclFromFallbackAcl, getAgentAccessAll, getAgentDefaultAccess, getAgentDefaultAccessAll, getAgentResourceAccess, getAgentResourceAccessAll, getFallbackAcl, getResourceAcl, getSolidDatasetWithAcl, getThing, hasAccessibleAcl, hasFallbackAcl, hasResourceAcl, isContainer, saveAclFor, setAgentDefaultAccess, setAgentResourceAccess } from '@inrupt/solid-client'
import BaseModal from './base-modal'
import { BsCheckLg, BsCheckSquare, BsSquare } from 'react-icons/bs'
import { getDefaultSession } from '@inrupt/solid-client-authn-browser'
import { SolidDatasetWithAcl } from '../lib/utilities'

// Renders sharing interface for notes and noteContainers
export default function ShareModal (props: {
    dataset: SolidDatasetWithAcl, 
    isOpen: boolean, 
    setIsOpen: Dispatch<SetStateAction<boolean>>,
}) {
    const [inputWebId, setInputWebId] = useState("")

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const webId = e.target.value
        setInputWebId(webId)
    }

    // fetch dataset permissions
    const explicitAclDataset = getResourceAcl(props.dataset)
    const fallbackAclDataset = getFallbackAcl(props.dataset)
    const effectiveAclDataset = explicitAclDataset ? explicitAclDataset: fallbackAclDataset;

    // if no AclDataset found, then likely user cannot access the dataset
    if (!effectiveAclDataset){
        return <BaseModal {...props} title='Share Error'>
            <div className='flex justify-center w-full'>
                Could not find access information. Please refresh page
            </div> 
        </BaseModal>
    }
    // Otherwise, effectiveAclDataset is initial acl for the current resource

    // record of current agents and their access permissions
    const agentResourceAccessAll = getAgentResourceAccessAll(effectiveAclDataset)

    return ( <BaseModal {...props} title='Share'>
        { /* main sharing interface */} 
        <div className="w-full sm:p-2 h-full ">
            {/** searchbar to input webId to share with */}
            <div className='md:flex w-full p-1 sm:p-4'>
                <label className='text-xl md:pr-2'>
                    <div className='flex justify-center'>WebId: </div>
                </label>
                <WebIdSearchBar 
                    webId={inputWebId} setWebId={setInputWebId} 
                    agentAccesses={agentResourceAccessAll}
                />
            </div>
            <AccessControlEditor dataset={props.dataset} 
                initialAclDataset={effectiveAclDataset}
                inputWebId={inputWebId}/>
        </div>
    </BaseModal>)
}

const noteModeDescription: Record<string, string> = {
    read: "Allow agent to read the note's data", 
    append: "Allow agent to add information to a note",
    write: "Allow agent to edit and delete note's data", 
    control: "Allow agent to manage access permissions for this note (unsafe)"
}

function AccessModeToggle(props: {
    mode: string, 
    description: string, 
    enabled: boolean, 
    onClick: MouseEventHandler<HTMLDivElement>,
}){
    console.log(props)
    return (<div 
        className='grid grid-cols-12 w-full'> 
        {/** Checkbox */}
        <div 
            onClick={props.onClick}
            className='hover:text-primary mx-auto my-auto'>
            {props.enabled ? <BsCheckSquare /> : <BsSquare />}
        </div>
        {/** Description of the props.mode */}
        <div className='col-span-11 md:mr-2 flex w-full'>
            <p className='font-bold pr-1'>{props.mode} - </p>
            <p>{props.description}</p>
        </div>
    </div>)
}

function AccessControlEditor(props: {
    initialAclDataset: AclDataset, 
    dataset: SolidDatasetWithAcl,
    inputWebId: string,
}){
    // initial inputWebId's permissions
    const initialAgentResourceAccess 
        = getAgentResourceAccess(props.initialAclDataset, props.inputWebId)
    const initialAgentDefaultAccess 
        = getAgentDefaultAccess(props.initialAclDataset, props.inputWebId)
    console.log(initialAgentDefaultAccess, initialAgentResourceAccess)
    
    const [inputWebIdAccess, setInputWebIdAccess] 
        = useState(initialAgentResourceAccess)
    const [defaultAccess, setDefaultAccess]  // default permissions for container's children
        = useState(initialAgentDefaultAccess)

    const session = getDefaultSession()
    const sessionWebId = session.info.webId
    const canChangeAccess = sessionWebId !== undefined && getAgentResourceAccess(props.initialAclDataset, sessionWebId).control
    const iscontainer = isContainer(props.dataset)

    const saveAclDatasets = async () => {
        let initialAclDataset = props.initialAclDataset
        if (!hasResourceAcl(props.dataset)) {
            if (!hasAccessibleAcl(props.dataset)){
                throw new Error("No Accessible Acl. Try logging in again")
            } 
            if (!hasFallbackAcl(props.dataset)){
                throw new Error("No fallback Acl. Try logging in again")
            } 
            initialAclDataset = createAclFromFallbackAcl(props.dataset)
        }
        const newResourceAclDataset 
            = setAgentResourceAccess(
                initialAclDataset, 
                props.inputWebId,
                inputWebIdAccess, )
        // if dataset is for a container, update default children permissions
        const newAclDataset = iscontainer ? setAgentDefaultAccess(
            newResourceAclDataset, 
            props.inputWebId,
            defaultAccess,
        ) : newResourceAclDataset
        
        const res = await saveAclFor(props.dataset, newAclDataset, {fetch: session.fetch})
        console.log(newAclDataset, res)
    }

    return (<>
        {/** Display checklist for each access mode */}
        <div className='w-full border border-gray-200 py-1 mb-4 rounded space-y-2'>
            { // show different permissions (and their descriptions) for container vs note
            iscontainer ?  <> 
                <h2>Container Permissions</h2>
                <hr className='w-full border border-gray-200'/>
                <h2>Default Children Permissions</h2>
            </> : Object.entries(inputWebIdAccess).map(([mode, enabled], index) => {
                console.log(mode, enabled)
                return <AccessModeToggle 
                    mode={mode} enabled={enabled} 
                    description={noteModeDescription[mode]}
                    onClick={() => setInputWebIdAccess({...inputWebIdAccess, [mode]: !enabled})}
                    key={`namt#${index}`}/>
                })}
        </div>
        {/** Buttons to save granted access modes and reset to initial modes */}
        <div className='w-full flex flex-none justify-evenly pb-4'>
            <button 
                className={`w-fit ${!canChangeAccess ? 
                    'bg-gray-200 text-gray-300 hover:bg-gray-200' : 
                    'bg-neutral'}`} 
                disabled={!canChangeAccess} 
                onClick={(_) => saveAclDatasets()}
                >Save</button>
            <button className='bg-neutral w-fit' onClick={(e) => {
                setInputWebIdAccess(initialAgentResourceAccess) 
                setDefaultAccess(initialAgentDefaultAccess)
            }}>Reset</button>
        </div>
    </>)
}

function WebIdSearchBar(props: {
    webId: string, 
    setWebId: Dispatch<SetStateAction<string>>,
    agentAccesses: AgentAccess,
}) {
    const filteredAgentAccesses = 
      Object.entries(props.agentAccesses).filter(([webId, access]) => {
        return webId.toLowerCase().includes(props.webId.toLowerCase())
      });
  
    return (
      <Combobox 
        value={props.webId} 
        onChange={(s) => props.setWebId(s)} 
        as='div'
        className='w-full'>
        <Combobox.Input 
            onChange={(event) => props.setWebId(event.target.value)} 
            className='rounded border border-gray-200 w-full pl-1'
            type='url'
        />
        <Combobox.Options>
          {filteredAgentAccesses.map(([webId, _], i) => (
            <Combobox.Option key={`faa${i}`} value={webId} as={Fragment}>
            {({active, selected}) => (
                <li className={`w-full ${active ? 'bg-gray-100 text-primary' : 'bg-base text-black'}`}>
                    <div className='grid grid-cols-12 w-full'>
                        <div className='mx-auto'>{selected && <BsCheckLg />}</div>
                        <div className='col-span-11 w-full'> {webId} </div>
                    </div>
                </li>
            ) }
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </Combobox>
    )
  }


