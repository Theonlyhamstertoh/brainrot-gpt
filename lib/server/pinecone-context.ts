import { openai } from "@ai-sdk/openai"
import { string, z } from "zod"
import {
  CoreMessage,
  DeepPartial,
  generateId,
  generateObject,
  Message,
} from "ai"

import { getTranscriptContext, initPineconeClient } from "@/lib/server/pinecone"
import {
  Prompt,
  ANALYZE_QUESTION_SYSTEM_PROMPT,
  SYSTEM_PROMPT,
  NAMEPLATE_SYSTEM_PROMPT,
} from "@/lib/core/prompts"

// Function to extract user messages
const extractUserMessages = (
  messages: Message[],
  startIndex: number
): string => {
  return messages
    .slice(startIndex)
    .map((message: Message, index: number) => {
      return `${index + 1}. ${message.role}: ${message.content.trim()}`
    })
    .join("\n")
}

const pineconeSchema = z.object({
  pinecone: z.boolean().describe("Whether to use Pinecone context"),
  follow_up: z
    .boolean()
    .describe("The last question is a followup to the previous"),
  // rating: z
  //   .number()
  //   .describe(
  //     "The relatedness score of the last question to the previous question"
  //   ),
  // explanation: z.string().describe("Explanation of decision"),
  improved_question: z.string().nullable(),
})
export type Pinecone = DeepPartial<typeof pineconeSchema>
let index = 0

// Function to analyze if Pinecone context is needed and if the query needs improvement
export const analyzePineconeNeedAndQuery = async (
  messages: Message[]
): Promise<Pinecone> => {
  const userMessages = extractUserMessages(messages, index)
  const prompt = `Questions:\n${userMessages}`
  console.log("extracted user PROMPT", prompt)

  const { object } = await generateObject({
    model: openai("gpt-4o-mini"),
    schema: pineconeSchema,
    presencePenalty: 0,
    maxTokens: 128,
    frequencyPenalty: 0,
    system: ANALYZE_QUESTION_SYSTEM_PROMPT,
    temperature: 0,
    prompt: prompt,
  })

  // if (!object.follow_up) index = messages.length - 1

  return object
}

export const processPineconeContextAndQuery = async (
  input: string,
  messages: Message[]
): Promise<string> => {
  const pineconeClient = await initPineconeClient()
  // console.time("Improve Question: ")
  // const result = await analyzePineconeNeedAndQuery(messages)
  // console.timeEnd("Improve Question: ")

  // if (!result.pinecone) return input
  // const query = result.improved_question || input
  // console.time("pinecone: ")

  const context = await getTranscriptContext(input, pineconeClient)
  console.timeEnd("pinecone: ")
  // return Prompt(query, context)
  return context
}
