"use client"

import { LoginButton } from "@inrupt/solid-ui-react";
import { useEffect, useState } from "react";

export default function (){
    const [oidcIssuer, setOidcIssuer] = useState("https://inrupt.net")
    const [currentUrl, setCurrentUrl] = useState("")

    useEffect(() => {
        setCurrentUrl(window.location.origin)
    }, [setCurrentUrl])

    return (<>
        <label>oidcIssuer</label> <br />
        <textarea 
            name="oidcIssuer"
            value={oidcIssuer}
            onChange={(e) => setOidcIssuer(e.target.value)}
        />
        <LoginButton 
            oidcIssuer={oidcIssuer}
            redirectUrl={currentUrl}
        />
    </>)
}
