/**
 *
 * @description Functions related to working with Pinecone Vector Database
 *
 */
import { OpenAIEmbedding } from "@/lib/api/embedding"
import { TranscriptMetadata } from "@/types"
import { Index, Pinecone, PineconeRecord } from "@pinecone-database/pinecone"
import { EmbeddingCreateParams } from "openai/resources"

if (!process.env.TOP_K || process.env.TOP_K === undefined) {
  throw new Error("Missing Environment Variable TOP_K")
}

let pinecone: Pinecone | null = null

export const initPineconeClient = async () => {
  if (!pinecone) {
    pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    })
    return pinecone
  } else {
    console.log("Pinecone client already initialized. Using existing client.")
  }
  return pinecone
}

// Get the transcript context based on the user message and return all possible matches and return a concatenated context string
export const getTranscriptContext = async (
  input: string,
  pinecone: Pinecone,
  namespace: string = ""
) => {
  try {
    const matches = await getMatchesFromEmbeddings(input, pinecone, namespace)

    // Create a context string to be concatenated into the prompt
    let filteredMatches: TranscriptMetadata[] = []

    const context = matches.reduce((previousValue: string, match, index) => {
      const lowerCaseMetadata = Object.keys(
        match.metadata as TranscriptMetadata
      ).reduce((result, key) => {
        result[key.toLowerCase()] = (match.metadata as TranscriptMetadata)[key]
        return result
      }, {} as any)

      const formattedContext = formatMetadata(lowerCaseMetadata)
      filteredMatches.push(lowerCaseMetadata as TranscriptMetadata)
      return previousValue + "\n" + formattedContext
    }, "")

    // return { matches: filteredMatches, context }
    return context
  } catch (err) {
    if (err instanceof Error) {
      console.log(err)
      throw Error(err.message)
    }
    throw Error("There was an error with getTranscriptContext")
  }
}

function formatMetadata(metadata: TranscriptMetadata) {
  let formattedOutput = ""

  // Add Problem and Solution first
  formattedOutput += `Problem: ${metadata.problem}\n`
  formattedOutput += `Solution: ${metadata.solution}\n`

  // Add other fields
  for (let [key, value] of Object.entries(metadata)) {
    if (key !== "problem" && key !== "solution") {
      // Convert snake_case to Title Case
      let formattedKey = key
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")

      formattedOutput += `${formattedKey}: ${value}\n`
    }
  }

  return formattedOutput
}

export const getMatchesFromEmbeddings = async (
  input: string,
  pinecone: Pinecone,
  namespace: string
): Promise<PineconeRecord[]> => {
  const { indexes } = await pinecone.listIndexes()

  if (!indexes?.find((index) => index.name === process.env.PINECONE_INDEX!)) {
    return []
  }

  const index = pinecone
    .index<TranscriptMetadata>(process.env.PINECONE_INDEX!)
    .namespace(namespace)

  const dimensionSize = (await index.describeIndexStats()).dimension!
  const embedding = await OpenAIEmbedding(input, dimensionSize)

  try {
    const queryResult = await index.query({
      vector: embedding,
      topK: parseInt(process.env.TOP_K!),
      includeValues: false,
      includeMetadata: true,
    })
    // const dupeIds = findDuplicates(queryResult.matches!)

    // asyncronously delete duplicate vectors if exists
    // deleteDupeVectorIfExist(index, dupeIds)

    return (
      queryResult.matches?.filter((match) => {
        // if (dupeIds.includes(match.id) === false) {
        return {
          id: match.id,
          metadata: match.metadata as TranscriptMetadata,
        }
        // }
      }) || []
    )
  } catch (err) {
    throw new Error(`Error querying embeddings: ${err}`)
  }
}

const deleteDupeVectorIfExist = async (pineconeIndex: Index, ids: string[]) => {
  if (ids.length === 0) return
  console.log("Deleting duplicated vectors: ", ids)
  await pineconeIndex.deleteMany({
    ids: ids,
  })
}

const findDuplicates = (matches: PineconeRecord[]) => {
  const duplicateIDs = []
  const seenMatches = new Set()

  for (const match of matches) {
    const id = match.id
    const metadata = JSON.stringify(match.metadata) // Convert metadata object to string for easy comparison

    const seenMatchesString = seenMatches.has(metadata)
    if (seenMatchesString) {
      duplicateIDs.push(id)
    } else {
      seenMatches.add(metadata)
    }
  }
  return duplicateIDs
}
