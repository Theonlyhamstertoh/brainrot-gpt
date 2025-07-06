"use client"
import { use, useEffect, useState } from "react"
import { AIAvatar } from "../ai-avatar"
import { BuildOpsIcon } from "../icons"
import { AIMessageWrapper } from "./ai-message-wrapper"
import { ChatLoading } from "../chat"

export const AIFirstMessage = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => setLoading(false), 500)
  }, [])
  return loading ? (
    <ChatLoading className="mt-10" />
  ) : (
    <AIMessageWrapper isLast className="">
      <div>
        <div className="prose animate-in fade-in text-2xl text-black duration-500">
          Welcome! What are you working on today? For Example
        </div>
      </div>
    </AIMessageWrapper>
  )
}
