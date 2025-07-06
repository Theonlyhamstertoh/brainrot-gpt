"use client"
import React, { use, useEffect, useState } from "react"

import { useScrollAnchor } from "@/hooks/use-scroll-anchor"
import { ChatInput } from "./chat-input"
import { v4 as uuidv4 } from "uuid"
import { cn } from "@/lib/utils"
import { ChatLoading } from "./chat-loading"
import { generateId, Message } from "ai"
import { ChatList } from "./chat-list"

import { useSearchParams } from "next/navigation"
import ChatDecisionTree from "./chat-decision-tree"
import { AIFirstMessage } from "../messages/ai-first-message"

import { useChat } from "@ai-sdk/react"
import { mutate, useSWRConfig } from "swr"
import ChatHeader from "@/components/chat/chat-header"
import ErrorAlertMessage from "@/components/messages/error-message"
import { useAppendMessage } from "@/hooks/use-append-message"

import Cookies from "js-cookie"

export const Chat = ({
  id,
  title,
  initialMessages,
  userChatId,
  className,
}: {
  className?: string
  id: string
  userChatId?: string
  title?: string
  initialMessages?: Message[]
}) => {
  const { messagesRef, scrollRef, isAtBottom, scrollToBottom } =
    useScrollAnchor()

  // Get company store values to pass to API

  // Automatically scroll to bottom on message sent

  const [skip, setSkip] = useState(false)

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    status,
    stop,
    setInput,
    addToolResult,
    append,
  } = useChat({
    api: "/api/v1/chat",
    id,
    experimental_throttle: 50,
    initialMessages: initialMessages ?? [],
    sendExtraMessageFields: true,
    generateId: uuidv4,

    onFinish: async (message) => {},
    onError: async (error) => {
      console.log(error)
    },
  })

  const { appendMessage } = useAppendMessage(append)

  const isLoading = status === "streaming" || status === "submitted"

  if (status == "streaming" && isAtBottom) scrollToBottom()

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      {/* Header */}

      <div
        id="scrollRef"
        ref={scrollRef}
        className={cn(
          "relative flex grow flex-col items-center overflow-y-scroll",
          className
        )}
      >
        <div
          ref={messagesRef}
          className={cn(
            "mx-auto w-full max-w-4xl pb-[20px] md:px-6",
            isLoading && "pb-[80px]"
            // !messages.length && "h-full" // if placeholder
          )}
        >
          {/* <ChatLoading /> */}
          {messages.length ? (
            <ChatList
              appendMessage={appendMessage}
              addToolResult={addToolResult}
              messages={messages}
              isLoading={isLoading}
              chatId={id}
            />
          ) : skip ? (
            <AIFirstMessage />
          ) : (
            <ChatDecisionTree appendMessage={appendMessage} setSkip={setSkip} />
          )}

          {status === "error" && <ErrorAlertMessage />}
          {status === "submitted" &&
            messages.length > 0 &&
            messages[messages.length - 1].role === "user" && <ChatLoading />}
        </div>
        {messages.length > 0 && <div className="grow"></div>}
        <div className="sticky inset-x-0 bottom-0 flex w-full flex-col items-center justify-center gap-2 border-gray-100 bg-transparent px-2.5 pb-4">
          <ChatInput
            appendMessage={appendMessage}
            stop={stop}
            id={id}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            messages={messages}
            status={status}
            input={input}
            setInput={setInput}
          />
        </div>

        {/* <ChatSearchBar /> */}
      </div>
    </div>
  )
}
