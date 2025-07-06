"use client"

import { UseChatHelpers } from "@ai-sdk/react"
import { track } from "@vercel/analytics/react"

export type AppendMessageOptions = {
  content: string
  pinecone?: boolean
  customContent?: string
  tool?:
    | "createJobDescription"
    | "getFullModelByUUID"
    | "askForConfirmation"
    | "getModelById"
  jobSummary?: "technical" | "customer"
}

export type UseAppendMessageHelpers = {
  appendMessage: (options: AppendMessageOptions) => void
}
export const useAppendMessage = (
  append: UseChatHelpers["append"]
): UseAppendMessageHelpers => {
  const appendMessage = ({
    content,
    pinecone,
    tool,
    customContent,
    jobSummary,
  }: AppendMessageOptions) => {
    append(
      {
        content,
        role: "user",
        ...(customContent ? { data: { customContent } } : {}),
      },
      {
        body: {
          pinecone,
          tool,
          jobSummary,
        },
      }
    )
  }

  return { appendMessage }
}
