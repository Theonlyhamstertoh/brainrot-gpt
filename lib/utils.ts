import { Database } from "@/types"
import { CustomMessageProps } from "@/types"
import { CoreAssistantMessage, CoreToolMessage, Message, UIMessage } from "ai"
import { type ClassValue, clsx } from "clsx"
import { ReadonlyURLSearchParams } from "next/navigation"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function validateInteger(value: string | null) {
  if (value === null) return null
  const parsedValue = parseInt(value)
  if (!isNaN(parsedValue) && Number.isInteger(parsedValue)) {
    return parsedValue // It's an integer, return the parsed integer value
  } else {
    return null // It's not an integer, return null
  }
}

export function formatSeconds(totalSeconds: number) {
  const min = Math.floor(totalSeconds / 60)
  const sec = totalSeconds % 60
  const mm = String(min).padStart(2, "0")
  const ss = String(sec).padStart(2, "0")

  return `${mm}:${ss}`
}

export function isNonEmptyString(str: string) {
  return str.trim().length > 0
}

export async function getBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result)
      }
    }
    reader.onerror = (error) => {
      console.log("Error: ", error)
      reject(error)
    }

    reader.readAsDataURL(file)
  })
}

export const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function getMostRecentUserMessage(messages: Array<UIMessage>) {
  const userMessages = messages.filter((message) => message.role === "user")
  return userMessages.at(-1)
}

// Saving Messages
type ResponseMessageWithoutId = CoreToolMessage | CoreAssistantMessage
export type ResponseMessage = ResponseMessageWithoutId & { id: string }
export function getTrailingMessageId({
  messages,
}: {
  messages: Array<ResponseMessage>
}): string | null {
  const trailingMessage = messages.at(-1)

  if (!trailingMessage) return null

  return trailingMessage.id
}

export function filterMessagesForJobSummary(messages: CustomMessageProps[]) {
  // Return Message[] without Job Summary Tool Calls
  return messages.filter((message: CustomMessageProps) => {
    if (message.role === "assistant") {
      const hasJobSummaryToolCall = message.parts.some(
        (part) =>
          part.type == "tool-invocation" &&
          part.toolInvocation.toolName === "createJobDescription"
      )
      if (hasJobSummaryToolCall) return false
    }

    if (
      message.role === "user" &&
      message.data &&
      message.data?.customContent?.includes("Job Summary")
    ) {
      return false
    }
    return true
  })
}
