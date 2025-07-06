import { experimental_transcribe as transcribe } from "ai"
import { readFile } from "fs/promises"
import { NextResponse } from "next/server"
import path from "path"
import OpenAI from "openai"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get("file") as File

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
  }

  try {
    const { text } = await openai.audio.transcriptions.create({
      file,
      model: "gpt-4o-transcribe",
      response_format: "json",
    })

    return NextResponse.json({ text })
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Transcription failed", details: error },
      { status: 500 }
    )
  }
}
