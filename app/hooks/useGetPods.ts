import { getPodUrlAll } from "@inrupt/solid-client";
import { useSession } from "@inrupt/solid-ui-react";
import { useEffect, useState } from "react";

export default function useGetPods(){
    const {session} = useSession()
    const emptyStrArr: string[] = []
    const [pods, setPods] = useState(emptyStrArr)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("");

    const webId = session.info.webId as string
    if (!webId) return {pods, loading, error: "Not logged in"}
    useEffect(() => {
        getPodUrlAll(webId, { fetch: session.fetch }).catch(setError).then(
            (pods) => {
                console.log("Got pods:", pods)
                setLoading(false)
                if (pods)
                    setPods(pods)
            }
        )
    }, [])
    return {pods, loading, error}
}