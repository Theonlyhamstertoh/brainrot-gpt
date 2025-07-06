import { MicIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  useAudioRecorder,
  UseAudioRecorderProps,
} from "@/hooks/use-voice-recorder"
import { CheckIcon, LoaderIcon, XIcon } from "lucide-react"
import React from "react"
import toast from "react-hot-toast"

type ChatVoiceRecorderProps = Pick<
  UseAudioRecorderProps,
  | "recording"
  | "isTranscribing"
  | "startRecording"
  | "clearRecording"
  | "stopRecording"
> & {
  isLoading: boolean
  handleSaveRecording: (e: React.MouseEvent<HTMLButtonElement>) => void
}

function ChatVoiceRecorder({
  clearRecording,
  isTranscribing,
  startRecording,
  recording,
  handleSaveRecording,
  isLoading,
}: ChatVoiceRecorderProps) {
  const handleStartRecording = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    startRecording()
  }

  const handleDiscardRecording = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    clearRecording()
    toast.success("Recording discarded")
  }

  // if not recording or transcribing
  if (!recording && !isTranscribing) {
    return (
      <Tooltip>
        <TooltipContent>Voice to Text</TooltipContent>
        <TooltipTrigger asChild>
          <Button
            onClick={handleStartRecording}
            variant={"secondary"}
            size={"icon"}
            disabled={isLoading && isTranscribing}
            className={
              "group border-border/70 mr-2 size-9 shrink-0 rounded-full border bg-transparent hover:cursor-pointer disabled:cursor-not-allowed"
            }
          >
            <MicIcon className={`size-5 text-stone-500`} />
          </Button>
        </TooltipTrigger>
      </Tooltip>
    )
  }

  if (recording || isTranscribing) {
    return (
      <React.Fragment>
        <Button
          onClick={handleDiscardRecording}
          variant={"secondary"}
          size="icon"
          disabled={isTranscribing}
          className={
            "group border-border/70 mr-2 size-9 shrink-0 rounded-full border bg-transparent hover:cursor-pointer disabled:cursor-not-allowed"
          }
        >
          <XIcon className="size-5 text-stone-500 group-disabled:text-stone-300" />
        </Button>
        <Button
          onClick={handleSaveRecording}
          size={"icon"}
          disabled={isTranscribing}
          className="grid bg-black rounded-full size-9 shrink-0 place-items-center"
        >
          {isTranscribing ? (
            <LoaderIcon className="text-white size-5 animate-spin" />
          ) : (
            <CheckIcon className="text-white size-5" />
          )}
        </Button>
      </React.Fragment>
    )
  }
}
export default ChatVoiceRecorder
