import { useContext } from "react";
import { SolidContext } from "../context-providers";

export default function useGetDatabaseIRI(){
    const {selectedPodUrl} = useContext(SolidContext)
    if (!selectedPodUrl) return undefined
    return `${selectedPodUrl}journalEntries`
}
