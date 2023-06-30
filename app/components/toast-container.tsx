"use client"

import { useContext } from "react"
import { ToastContext } from "../context-providers"

export default function ToastContainer(){
  const {toasts} = useContext(ToastContext)
  return (
    <div className="grid grid-cols-1 w-40">
      {toasts.map((t, id) => (
        <div key={`toast${id}`} className="border border-gray-300 bg-base rounded">
          {t}
        </div>
      ))}
    </div>
  )
}
