import { NextResponse } from "next/server"
import fs from "fs"
import { Readable } from "stream"
import { OpenAI } from "openai"

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing Environment Variable OPENAI_API_KEY")
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// ElevenLabs configuration
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY
const ELEVENLABS_BASE_URL = "https://api.elevenlabs.io/v1"

type Input = {
  text: string
  voice?: string
  outputFormat?: string
  speed?: number
  voiceModel?: string
  provider?: "openai" | "elevenlabs"
}

export async function POST(req: Request) {
  const { text, voice, outputFormat, speed, voiceModel, provider }: Input =
    await req.json()
  if (text === "" || !text?.trim()) {
    return NextResponse.json("No input was provided")
  }

  // ElevenLabs provider
  if (provider === "elevenlabs") {
    if (!ELEVENLABS_API_KEY) {
      console.warn("ElevenLabs API key not found, falling back to OpenAI")
    } else {
      try {
        const voiceId = "CeNX9CMwmxDxUF5Q2Inm"

        const elevenlabsResponse = await fetch(
          `${ELEVENLABS_BASE_URL}/text-to-speech/${voiceId}`,
          {
            method: "POST",
            headers: {
              Accept: "audio/mpeg",
              "Content-Type": "application/json",
              "xi-api-key": ELEVENLABS_API_KEY,
            },
            body: JSON.stringify({
              text: text,
              model_id: "eleven_multilingual_v2",
              voice_settings: {
                stability: 0.5,
                similarity_boost: 0.5,
                style: 0.0,
                use_speaker_boost: true,
              },
            }),
          }
        )

        if (elevenlabsResponse.ok) {
          return new Response(elevenlabsResponse.body, {
            headers: {
              "Content-Type": "audio/mpeg",
            },
          })
        }
      } catch (error) {
        console.error("ElevenLabs TTS error:", error)
      }
    }
  }

  // Fallback to OpenAI
  const response = await openai.audio.speech.create({
    model: (voiceModel as any) ?? "tts-1",
    voice: (voice as any) ?? "alloy",
    input: text,
    speed: speed ?? 1.0,
    response_format: (outputFormat as any) ?? "mp3",
  })

  // const rs = await fetch("https://api.openai.com/v1/audio/speech", {
  //     method: "POST",
  //     headers: {
  //         Authorization: "Bearer " + process.env.OPENAI_API_KEY,
  //         "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //         input: "What is up?!",
  //         model: "tts-1",
  //         response_format: "mp3",
  //         voice: "echo",
  //     }),
  // }).then((res) => res.body);

  // const reader = rs.getReader();

  // reader.read().then(function process({ done, value }) {
  //     if (done) {
  //         console.log("done ");
  //     }

  //     console.log(value);
  // });
  // reader.read().then(function process({ done, value }) {
  //     if (done) {
  //         console.log("done ");
  //     }

  //     console.log(value);
  // });
  // reader.read().then(function process({ done, value }) {
  //     if (done) {
  //         console.log("done ");
  //     }

  //     console.log(value);
  // });

  // console.log(response.body);
  // const readableStream = new Readable();
  // readableStream._read = () => {}; // No-op _read implementation

  // readableStream.push(Buffer.from(response.arrayBuffer()));
  // readableStream.push(null);

  return new Response(response.body, {
    headers: {
      "Content-Type": response.type,
    },
  })
}
