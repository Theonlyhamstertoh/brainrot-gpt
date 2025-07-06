import React from "react"
import { Message, ToolInvocation } from "ai"
import {
  AIJobMessage,
  AIMessage,
  UserMessage,
  UserToolMessage,
} from "../messages"

import { ChatLoading } from "./chat-loading"
import { stat } from "fs"
import { UseAppendMessageHelpers } from "@/hooks/use-append-message"

// Types
type ToolResult = {
  toolCallId: string
  result: unknown
}

interface ChatListProps {
  messages: Message[]
  chatId: string
  isLoading: boolean
  appendMessage: UseAppendMessageHelpers["appendMessage"]
  addToolResult: (params: ToolResult) => void
}

interface MessageRendererProps {
  message: Message
  chatId: string
  isLast: boolean
  appendMessage: UseAppendMessageHelpers["appendMessage"]

  isLoading: boolean
}

// Type Guards
const hasToolResult = (
  toolInvocation: ToolInvocation
): toolInvocation is ToolInvocation & { state: "result" } => {
  return toolInvocation.state === "result"
}

const isJobDescription = (toolName: string): boolean => {
  return toolName === "createJobDescription"
}
const isFetchingContext = (toolName: string): boolean => {
  return toolName === "fetchContext"
}

const isModelLookup = (toolName: string): boolean => {
  return toolName === "getFullModelByUUID"
}

const isNone = (toolName: string): boolean => {
  return ![
    "createJobDescription",
    "fetchContext",
    "getFullModelByUUID",
  ].includes(toolName)
}

// Main Components
export const ChatList: React.FC<ChatListProps> = ({
  messages,
  isLoading,
  addToolResult,
  chatId,
  appendMessage,
}) => {
  if (!messages?.length) {
    return null
  }

  return (
    <div className="chat-list">
      {messages.map((message, index) => (
        <MessageRenderer
          appendMessage={appendMessage}
          key={message.id || index}
          chatId={chatId}
          message={message}
          isLast={index === messages.length - 1}
          isLoading={isLoading}
        />
      ))}
    </div>
  )
}

const MessageRenderer: React.FC<MessageRendererProps> = ({
  message,
  isLast,
  isLoading,
  chatId,
  appendMessage,
}) => {
  if (message.role === "user") {
    return message.parts?.map((part, index) => {
      const { type } = part
      const key = `message-${message.id}-part-${index}`

      if (type === "text") {
        return <UserMessage key={key}>{part.text}</UserMessage>
      }
    })
  }

  if (message.role === "assistant") {
    return message.parts?.map((part, index) => {
      const { type } = part
      const key = `message-${message.id}-part-${index}`

      if (type === "tool-invocation") {
        const { toolInvocation } = part
        const { toolName, toolCallId, state } = toolInvocation

        if (state === "call") {
          // Loading states for different tool types
          return (
            <div key={toolCallId}>
              {isJobDescription(toolName) && (
                <ChatLoading label="Creating Job Description" />
              )}
              {isFetchingContext(toolName) && (
                <ChatLoading label="Fetching Context" />
              )}
              {isModelLookup(toolName) && (
                <ChatLoading label="Getting Model Info" />
              )}
              {isNone(toolName) && <ChatLoading />}
            </div>
          )
        }

        if (state === "result") {
          const { result } = toolInvocation

          return (
            <div key={toolCallId}>
              {isJobDescription(toolName) && (
                <AIJobMessage description={result} />
              )}

              {/* {isNone(toolName) && (
                <pre className="overflow-x-auto rounded-md bg-gray-100 p-4">
                  {JSON.stringify(result, null, 2)}
                </pre>
              )} */}
            </div>
          )
        }
      }
      if (type === "text") {
        return (
          <AIMessage
            key={key}
            content={part.text}
            isLast={isLast}
            chatId={chatId}
            messageId={message.id}
            isLoading={isLoading}
          />
        )
      }
    })
  }

  console.warn("Unknown message type:", message.role)
  return null
}

export default ChatList
