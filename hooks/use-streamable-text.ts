"use client"

import { StreamableValue, readStreamableValue } from "ai/rsc"
import { useEffect, useState } from "react"

export const useStreamableText = (
  content: string | StreamableValue<string>
) => {
  const [rawContent, setRawContent] = useState(
    typeof content === "string" ? content : ""
  )

  const [isStreaming, setIsStreaming] = useState(
    typeof content === "string" ? false : true
  )

  useEffect(() => {
    ;(async () => {
      if (typeof content === "object") {
        let value = ""
        setIsStreaming(true)

        for await (const delta of readStreamableValue(content)) {
          // console.log(value + delta)
          // console.log(delta)
          value = value + delta
          // console.log(value)
          if (typeof delta === "string") {
            // console.log("value:", value)
            setRawContent(value)
          }
        }
        setIsStreaming(false)
      }
    })()
  }, [content])

  return { text: rawContent, isStreaming }
}
