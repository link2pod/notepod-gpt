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
          className="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
          value={oidcIssuer}
          onChange={(e) => setOidcIssuer(e.target.value)}
        />
        <div className="grid grid-cols-1 justify-evenly sm:grid-cols-2 w-full sm:gap-10 bg-gray mb-4">
          {oidcIssuers.map((url) => (
            <div
              key={url}
              className={`flex justify-center items-center w-full h-12 border border-gray-300 rounded cursor-pointer ${
                oidcIssuer === url ? 'border-primary' : ''
              }`}
              onClick={() => setOidcIssuer(url)}
            >
              <p>{url}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-between ">
          <button type="submit" className="bg-gray-800">Submit</button>
          <button type="reset" className="bg-gray-800">Cancel</button>
        </div>
      </form>
    </div>)
}
