"use client"

import { LoginButton, LogoutButton, useSession } from "@inrupt/solid-ui-react";
import { useEffect, useState } from "react";

export default function (){
    const [oidcIssuer, setOidcIssuer] = useState("http://localhost:3000")
    //const [oidcIssuer, setOidcIssuer] = useState("https://inrupt.net")
    const [currentUrl, setCurrentUrl] = useState("")

    useEffect(() => {
        setCurrentUrl(window.location.href)
    }, [setCurrentUrl])

    const {session} = useSession()

    if (session.info.isLoggedIn) {
        return (<>
            <LogoutButton />
        </>)
    }

    return (<>
        <label>oidcIssuer</label> 
        <input
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
