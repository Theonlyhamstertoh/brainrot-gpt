"use client"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2Icon, StopCircleIcon, Volume2Icon } from "lucide-react"
import { track } from "@vercel/analytics/react"
import toast from "react-hot-toast"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"

export function PlayAudioButton({ text }: { text: string }) {
  const [shortAudioURL, setShortAudioURL] = useState("")
  const [longAudioURL, setLongAudioURL] = useState("")
  const [loading, setLoading] = useState(false)
  const [playing, setPlaying] = useState(false)

  const shortAudioRef = useRef<HTMLAudioElement | null>(null)
  const longAudioRef = useRef<HTMLAudioElement | null>(null)

  // Cleanup URLs on unmount
  useEffect(() => {
    return () => {
      if (shortAudioURL) URL.revokeObjectURL(shortAudioURL)
      if (longAudioURL) URL.revokeObjectURL(longAudioURL)
    }
  }, [shortAudioURL, longAudioURL])

  // Play audio when short URL is set
  useEffect(() => {
    if (shortAudioURL && shortAudioRef.current && playing) {
      const playPromise = shortAudioRef.current.play()
      if (playPromise) {
        playPromise.catch((error) => {
          console.error("Playback failed:", error)
          setPlaying(false)
          shortAudioRef.current?.play()
        })
      }
    }
  }, [shortAudioURL, playing])

  const getTTS = async (text: string) => {
    try {
      if (!text) throw new Error("Text is empty")

      const url = "/api/v1/tts"
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) throw new Error("TTS request failed")

      const blob = await response.blob()
      const audioBlob = new Blob([blob], { type: "audio/wav" })
      const blobUrl = URL.createObjectURL(audioBlob)

      return blobUrl
    } catch (err) {
      console.error("Error during TTS fetch:", err)
    }
  }

  const handlePlayPause = async () => {
    if (playing) {
      if (shortAudioRef.current) {
        shortAudioRef.current.pause()
        shortAudioRef.current!.currentTime = 0
      }
      if (longAudioRef.current) {
        longAudioRef.current.pause()
        longAudioRef.current!.currentTime = 0
      }
      setPlaying(false)
      setLoading(false)
    } else {
      try {
        if (!shortAudioURL && !longAudioURL) {
          setLoading(true)

          const sentences = text.split(".")
          if (sentences.length > 3) {
            const shortText = sentences.slice(0, 2).join(".")
            const longText = sentences.slice(2).join(".")

            getTTS(longText).then(
              (blobUrl) => blobUrl && setLongAudioURL(blobUrl)
            )

            const blobUrl = await getTTS(shortText)
            blobUrl && setShortAudioURL(blobUrl)
          } else {
            const blobUrl = await getTTS(text)
            blobUrl && setShortAudioURL(blobUrl)
          }

          setLoading(false)
          setPlaying(true)
        } else {
          setPlaying(true)
          if (shortAudioRef.current) {
            const playPromise = shortAudioRef.current.play()
            if (playPromise) {
              playPromise.catch((error) => {
                console.error("Playback failed:", error)
                setPlaying(false)
                toast.error("Audio playback failed")
              })
            }
          }
        }
      } catch (error) {
        console.error("Error during audio handling:", error)
        setLoading(false)
        setPlaying(false)
        toast.error("There was an error preparing the audio")
      }
    }
  }

  const handleShortAudioEnded = async () => {
    try {
      if (longAudioURL && longAudioRef.current) {
        const playPromise = longAudioRef.current.play()
        if (playPromise) {
          playPromise.catch((error) => {
            console.error("Long audio playback failed:", error)
            setPlaying(false)
            toast.error("Audio playback failed")
          })
        }
      } else {
        setPlaying(false)
      }
    } catch (error) {
      console.error("Error during long audio playback:", error)
      setPlaying(false)
    }
  }

  const renderIcon = () => {
    if (playing) return <StopCircleIcon />
    if (loading) return <Loader2Icon className="animate-spin" />
    return <Volume2Icon />
  }

  return (
    <>
      <Tooltip>
        <TooltipContent>Play Audio</TooltipContent>
        <TooltipTrigger asChild>
          <Button
            variant="secondary"
            size="icon"
            className="bg-transparent *:size-4"
            onClick={handlePlayPause}
          >
            {renderIcon()}
          </Button>
        </TooltipTrigger>
      </Tooltip>
      {shortAudioURL && (
        <audio
          ref={shortAudioRef}
          src={shortAudioURL}
          autoPlay
          preload="auto"
          hidden
          onEnded={handleShortAudioEnded}
          onError={(e) => {
            console.error("Short audio playback error:", e)
            setLoading(false)
            setPlaying(false)
            toast.error("There was an error with audio playback")
          }}
        />
      )}
      {longAudioURL && (
        <audio
          ref={longAudioRef}
          src={longAudioURL}
          preload="auto"
          hidden
          onEnded={() => setPlaying(false)}
          onError={(e) => {
            console.error("Long audio playback error:", e)
            setPlaying(false)
            toast.error("There was an error with audio playback")
          }}
        />
      )}
    </>
  )
}
