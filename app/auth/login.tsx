"use client"

import { LoginButton, LogoutButton, useSession } from "@inrupt/solid-ui-react";
import { useEffect, useState } from "react";
import Spinner from "../lib/components/spinner";
import Logout from "./logout";

export default function (){
    const [oidcIssuer, setOidcIssuer] = useState("https://inrupt.net")
    const [currentUrl, setCurrentUrl] = useState("")

    useEffect(() => {
        setCurrentUrl(window.location.href)
    }, [setCurrentUrl])

    const {session, sessionRequestInProgress} = useSession()
    if (sessionRequestInProgress) return <Spinner />
    
    if (session.info.isLoggedIn) {
        return <Logout />
    }
    const handleLogin = (e: any) => {
        session.login({oidcIssuer, redirectUrl: currentUrl, clientName: "notepod-gpt"})
    }

    const oidcIssuers = ["https://inrupt.net", "http://localhost:3000"]

    return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Login</h1>

      <form className="mb-4" onSubmit={handleLogin}>
        <label htmlFor="url" className="mb-1 font-medium">
            ProviderUrl
        </label>
        <input
          type="url"
          id="url"
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
          value={oidcIssuer}
          onChange={(e) => setOidcIssuer(e.target.value)}
        />
      </form>

      {/* Selectable boxes */}
      <div className="grid justify-evenly sm:grid-cols-2 w-full sm:gap-10">
        {oidcIssuers.map((box) => (
          <div
            key={box}
            className={`flex justify-center items-center w-full h-12 border border-gray-300 rounded-full cursor-pointer ${
              /*selectedBoxes.includes(box) ? 'bg-primary text-white' : ''*/
              ""
            }`}
            onClick={() => setOidcIssuer(box.toString())}
          >
            <p>{box}</p>
          </div>
        ))}
      </div>
    </div>)
}
