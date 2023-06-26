"use client"

import { useEffect, useState } from "react";
import { useSession } from "@inrupt/solid-ui-react";

export default function Login(){
    const {session} = useSession()
    const [oidcIssuer, setOidcIssuer] = useState("Enter Oidc Issuer")
    const [currentUrl, setCurrentUrl] = useState("")
    const [showOidcIssuers, setShowOidcIssuers] = useState(false)

    useEffect(() => {
      setCurrentUrl(window.location.origin)
    }, [])

    const handleLogin = (e: any) => {
        session.login({oidcIssuer, redirectUrl: currentUrl, clientName: "notepod-gpt"})
    }

    const oidcIssuers = ["https://inrupt.net", "http://localhost:8000"]

    return (
      <form onSubmit={handleLogin}>
        <label htmlFor="url" className="mb-1 ">
            ProviderUrl
        </label>
        <input
          type="url"
          id="url"
          className="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
          value={oidcIssuer}
          onChange={(e) => setOidcIssuer(e.target.value)}
          onFocus={() => setShowOidcIssuers(true)}
          onBlur={() => setShowOidcIssuers(false)}
        />
        <div className={`${!showOidcIssuers} grid grid-cols-1 justify-evenly w-full bg-gray`}>
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
        <div className="flex justify-between mt-4">
          <button type="submit" className="bg-neutral">Submit</button>
          <button type="reset" className="bg-neutral">Cancel</button>
        </div>
      </form>
    )
}

