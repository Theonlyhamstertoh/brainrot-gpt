"use client"
import React, { memo, use, useEffect, useId, useState } from "react"

import { useStreamableText } from "@/hooks"
import { ChatFeedback, ChatMarkdown, ChatActions } from "@/components/chat"
import { AIMessageWrapper } from "./ai-message-wrapper"

import { cn } from "@/lib/utils"

import { AIMessageTTS } from "./ai-message-tts"

type AIMessageProps = {
  content: string
  question?: string
  isLoading?: boolean
  messageId: string
  chatId: string
  isLast?: boolean
}

export const AIUnmemoizedMessage = ({
  content,
  messageId,
  chatId,
  question = "",
  isLoading,
  isLast,
}: AIMessageProps) => {
  const [openFeedbackModal, setOpenFeedbackModal] = useState(false)

  return (
    <AIMessageWrapper isLast={isLast} isLoading={isLoading}>
      <div
        className={cn(
          "lg:prose-md prose relative w-full max-w-none grow",
          (!isLast || !isLoading) && "pb-4"
        )}
      >
        <ChatMarkdown content={content} />
        {(!isLast || !isLoading) && (
          <div className="mt-2 flex items-center justify-between gap-2">
            <AIMessageTTS text={content} messageId={messageId} />
          </div>
        )}
      </div>
    </AIMessageWrapper>
  )
}

export const AIMessage = memo(AIUnmemoizedMessage, (prevProps, nextProps) => {
  // Return true if props are equal (prevent re-render)
  // Return false if props are different (allow re-render)

  // Always re-render if loading state changes
  if (prevProps.isLoading !== nextProps.isLoading) return false

  // Always re-render if content changes
  if (prevProps.content !== nextProps.content) return false

  // Keep current render if props are the same
  return true
})
