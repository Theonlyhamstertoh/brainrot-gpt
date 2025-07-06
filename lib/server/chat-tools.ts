import { generateId } from "ai"

export function updateHistoryWithUserInput(
  history: any,
  input: string,
  image?: string
) {
  const newMessage = {
    role: "user",
    id: generateId(),
    content: image
      ? [
          { type: "text", text: input },
          { type: "image", image },
        ]
      : [{ type: "text", text: input }],
  }
  history.update({
    ...history.get(),
    messages: [...history.get().messages, newMessage],
  })
}

export const updateHistoryWithAIResponse = (history: any, input: string) => {
  history.done({
    ...history.get(),
    messages: [
      ...history.get().messages,
      {
        id: generateId(),
        role: "assistant",
        content: [{ type: "text", text: input }],
      },
    ],
  })
}
// clone history but with additional pinecone context. Prevent affecting original.
export function prepareMessagesForAI(
  history: any,
  prompt: string,
  image?: string
) {
  return image
    ? history.get().messages
    : [
        ...history.get().messages.slice(0, -1),
        {
          id: generateId(),
          role: "user",
          content: [{ type: "text", text: prompt }],
        },
      ]
}

export const updateHistoryWithToolResult = (
  history: any,
  toolName: string,
  result: any
) => {
  const toolCallId = generateId()
  history.done({
    ...history.get(),
    messages: [
      ...history.get().messages,
      {
        role: "assistant",
        id: generateId(),
        content: [
          {
            type: "tool-call",
            toolName: toolName,
            toolCallId,
            args: {},
          },
        ],
      },
      {
        id: generateId(),
        role: "tool",
        content: [
          {
            type: "tool-result",
            toolName: toolName,
            toolCallId,
            result: { text: result },
          },
        ],
      },
    ],
  })
}
