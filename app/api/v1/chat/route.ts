import { SYSTEM_PROMPT } from "@/lib/core/prompts"
import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"
import { v4 as uuidv4 } from "uuid"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return new Response("Invalid messages format", { status: 400 })
    }

    const result = streamText({
      model: openai("gpt-4.1-mini"),
      messages: messages,
      maxTokens: 2048,
      temperature: 0.7,
      system: SYSTEM_PROMPT,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Chat API error:", error)
    return new Response("Internal server error", { status: 500 })
  }
}
