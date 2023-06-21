import { ProfileAll, getProfileAll, getThing, getThingAll, getUrl } from "@inrupt/solid-client";
import { getDefaultSession } from "@inrupt/solid-client-authn-browser";
import {SOLID} from "@inrupt/vocab-solid";
import { forEach } from "lodash";

export function getIsoDate(){
    const date = new Date()
    date.setUTCHours(0,0,0,0) 
    return date.toISOString()
}

export function getEntryName(){ return `entry${getIsoDate()}` }

export function getContainerUrlPostfix(url: string){
    let startindex = url.length-1;
    while (startindex > 0 && url[startindex] !== '/') -- startindex
    return url.substring(startindex)
}

export const NoteDigitalDocument = "https://schema.org/NoteDigitalDocument"

export async function getRootContainer(url: string){
    var currUrl = url.concat("/")
    var rootContainerUrl = undefined as undefined | string
    while (currUrl.length > 0 && !rootContainerUrl){
        try{
            const res = await fetch(currUrl, {
                method: "HEAD", 
            })
            const headers = res.headers
            headers.forEach((value, key) => {
                if (key === "link"){
                    value.split(",").forEach((v) => {
                        const [url, rel] = v.split(";")
                        if (rel.trim() === `rel="type"` && url.trim() === "<http://www.w3.org/ns/pim/space#Storage>"){
                            rootContainerUrl = currUrl
                            return
                        }
                    })
                }
            })
        } catch(e) {}
        currUrl = currUrl.substring(0, currUrl.substring(0,currUrl.length-1).lastIndexOf("/")+1)
    }
    if (!rootContainerUrl) {
        throw new Error("Couldn't find root container")
    }
    return rootContainerUrl
}

export async function getPrivateTypeIndexUrl(webId: string){
    const session = getDefaultSession()
    const profile = await getProfileAll(webId, {fetch: session.fetch})
    var webIdThing = getThing(profile.webIdProfile, webId)
    if (!webIdThing) throw new Error("invalid solid profile")
    var privateTypeIndexUrl = getUrl(webIdThing, SOLID.privateTypeIndex)
    if (!privateTypeIndexUrl) {
        profile.altProfileAll.forEach((profileDataset) => {
            getThingAll(profileDataset).forEach((thing) => {
                const url = getUrl(thing, SOLID.privateTypeIndex)
                if (url) privateTypeIndexUrl = url
            })
        })
    }
    return privateTypeIndexUrl
}

