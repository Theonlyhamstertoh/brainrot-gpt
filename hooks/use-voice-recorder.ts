"use client"
import { useState, useRef, useEffect } from "react"
import toast from "react-hot-toast"

export type UseAudioRecorderProps = {
  recording: boolean
  mediaBlobUrl: string | null
  text: string | null
  isTranscribing: boolean
  seconds: number
  startRecording: () => Promise<void>
  stopRecording: () => Promise<Blob | null>
  clearRecording: () => void
  saveRecording: () => Promise<string | null>
}

export const useAudioRecorder = (): UseAudioRecorderProps => {
  const [recording, setRecording] = useState(false)
  const [mediaBlobUrl, setMediaBlobUrl] = useState<string | null>(null)
  const [text, setText] = useState<string | null>(null)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [seconds, setSeconds] = useState(0)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const mediaChunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)
  const timerRef = useRef<number | null>(null)

  // Cleanup on unmount
  useEffect(() => () => clearResources(), [])

  const clearResources = () => {
    // Stop recorder
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current!.onstop = () => {
        setRecording(false)
      }
      mediaRecorderRef.current.stop()
    }
    // Stop media tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
    // Revoke URL
    if (mediaBlobUrl) {
      URL.revokeObjectURL(mediaBlobUrl)
      setMediaBlobUrl(null)
    }
    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    setSeconds(0)
    mediaChunksRef.current = []
  }

  const createAudio = (): Blob | null => {
    if (!mediaChunksRef.current.length) {
      toast.error("No audio recorded")
      return null
    }
    if (mediaBlobUrl) URL.revokeObjectURL(mediaBlobUrl)
    const blob = new Blob(mediaChunksRef.current, { type: "audio/webm" })
    setMediaBlobUrl(URL.createObjectURL(blob))
    return blob
  }

  const startRecording = async () => {
    clearResources()
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      mediaChunksRef.current = []

      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" })
      mediaRecorderRef.current = recorder
      recorder.ondataavailable = (e) =>
        e.data.size && mediaChunksRef.current.push(e.data)
      recorder.start()
      setRecording(true)

      // start timer
      timerRef.current = window.setInterval(() => {
        setSeconds((prev) => prev + 1)
      }, 1000)

      toast.success("Recording started")
    } catch {
      toast.error("Could not access microphone")
    }
  }

  const stopRecording = (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current) {
        setRecording(false)
        resolve(null)
        return
      }
      mediaRecorderRef.current!.onstop = async () => {
        // stop timer
        if (timerRef.current) clearInterval(timerRef.current)
        timerRef.current = null

        const blob = createAudio()
        setRecording(false)
        toast.success("Recording stopped")
        resolve(blob)
      }
      mediaRecorderRef.current!.stop()
    })
  }

  const saveRecording = async (): Promise<string | null> => {
    const blob = await stopRecording()
    if (!blob) return null

    const transcribedText = await transcribeAudioToText(blob)

    return transcribedText
  }

  const transcribeAudioToText = async (blob: Blob): Promise<string | null> => {
    if (blob.size <= 100) {
      toast.error("Audio too short or empty")
      return null
    }
    setIsTranscribing(true)
    try {
      const formData = new FormData()
      formData.append("file", blob)
      const res = await fetch("/api/v1/transcribe", {
        method: "POST",
        body: formData,
      })
      if (!res.ok) throw new Error(`Transcription failed: ${res.status}`)
      const { text } = await res.json()
      if (text) setText(text)
      return text || null
    } catch (e) {
      console.error(e)
      toast.error("Failed to transcribe")
      return null
    } finally {
      setIsTranscribing(false)
    }
  }

  return {
    recording,
    mediaBlobUrl,
    text,
    isTranscribing,
    seconds,
    startRecording,
    stopRecording,
    clearRecording: clearResources,
    saveRecording,
  }
}
