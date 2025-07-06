"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"

interface AIMessageTTSProps {
  text: string
  messageId?: string
  autoPlay?: boolean
}

export const AIMessageTTS = ({
  text,
  messageId = "",
  autoPlay = true,
}: AIMessageTTSProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [hasGenerated, setHasGenerated] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Auto-generate speech when component mounts if autoPlay is enabled
  useEffect(() => {
    if (autoPlay && text.trim() && !hasGenerated) {
      const timer = setTimeout(() => {
        generateSpeech()
      }, 1000) // Small delay for better UX

      return () => clearTimeout(timer)
    }
  }, [autoPlay, text, hasGenerated])

  // Clean up text for TTS (remove markdown, special characters, etc.)
  const cleanTextForTTS = (text: string) => {
    return text
      .replace(/[#*_`~]/g, "") // Remove markdown formatting
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Convert links to just text
      .replace(/\n+/g, " ") // Replace newlines with spaces
      .replace(/\s+/g, " ") // Normalize whitespace
      .trim()
  }

  const generateSpeech = async () => {
    if (!text.trim()) return

    setIsLoading(true)
    setHasGenerated(true)

    try {
      const cleanText = cleanTextForTTS(text)

      const response = await fetch("/api/v1/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: cleanText,
          voice: "rachel", // ElevenLabs voice
          provider: "elevenlabs",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate speech")
      }

      const audioBlob = await response.blob()
      const url = URL.createObjectURL(audioBlob)
      setAudioUrl(url)

      // Auto-play the generated audio
      if (audioRef.current) {
        audioRef.current.src = url
        audioRef.current.play()
        setIsPlaying(true)
      }
    } catch (error) {
      console.error("TTS Error:", error)
      toast.error("Failed to generate speech")
    } finally {
      setIsLoading(false)
    }
  }

  const togglePlayPause = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const handleAudioEnded = () => {
    setIsPlaying(false)
  }

  const handlePlay = () => {
    setIsPlaying(true)
  }

  const handlePause = () => {
    setIsPlaying(false)
  }

  // Cleanup audio URL on unmount
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
    }
  }, [audioUrl])

  return (
    <div className="flex items-center gap-3">
      {/* Audio element */}
      <audio
        ref={audioRef}
        onEnded={handleAudioEnded}
        onPlay={handlePlay}
        onPause={handlePause}
        preload="none"
      />

      {/* Super Noticeable TTS Button */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={
          !hasGenerated
            ? {
                scale: [1, 1.05, 1],
                boxShadow: [
                  "0 0 0px rgba(255, 107, 0, 0)",
                  "0 0 20px rgba(255, 107, 0, 0.5)",
                  "0 0 0px rgba(255, 107, 0, 0)",
                ],
              }
            : {}
        }
        transition={{
          duration: 2,
          repeat: !hasGenerated ? Infinity : 0,
          ease: "easeInOut",
        }}
        className="relative"
      >
        {/* Pulsing ring effect */}
        {!hasGenerated && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-orange-500"
            animate={{
              scale: [1, 1.5],
              opacity: [0.5, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        )}

        <Button
          onClick={audioUrl ? togglePlayPause : generateSpeech}
          disabled={isLoading}
          variant="default"
          size="lg"
          className={cn(
            "relative h-12 w-12 overflow-hidden rounded-full p-0",
            "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600",
            "font-bold text-white shadow-xl",
            "border-2 border-white",
            "focus-visible:ring-4 focus-visible:ring-orange-300",
            isPlaying &&
              "from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600",
            isLoading && "from-yellow-500 to-orange-500"
          )}
          title={
            isLoading
              ? "🎙️ Generating speech..."
              : audioUrl
                ? isPlaying
                  ? "⏸️ Pause audio"
                  : "▶️ Resume audio"
                : "🔊 Play with AI voice!"
          }
        >
          {/* Background glow effect */}
          <motion.div
            className="absolute inset-0 bg-white"
            animate={
              isPlaying
                ? {
                    opacity: [0, 0.2, 0],
                  }
                : {}
            }
            transition={{
              duration: 1,
              repeat: isPlaying ? Infinity : 0,
            }}
          />

          {isLoading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : isPlaying ? (
            <VolumeX className="h-6 w-6" />
          ) : (
            <Volume2 className="h-6 w-6" />
          )}
        </Button>
      </motion.div>

      {/* Enhanced Visual indicator when playing */}
      {isPlaying && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="flex items-center gap-2"
        >
          <div className="flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 rounded-full bg-gradient-to-t from-orange-500 to-red-500"
                animate={{
                  height: [4, 20, 4],
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
          <span className="animate-pulse text-sm font-bold text-orange-600">
            🎵 Playing
          </span>
        </motion.div>
      )}

      {/* Auto-play indicator */}
      {!hasGenerated && autoPlay && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-full bg-orange-100 px-2 py-1 text-xs font-semibold text-orange-600"
        >
          🎙️ Auto-play enabled
        </motion.div>
      )}
    </div>
  )
}
