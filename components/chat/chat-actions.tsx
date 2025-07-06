"use client"

import {
  CheckIcon,
  CopyIcon,
  MessageCirclePlusIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from "lucide-react"
import { PlayAudioButton } from "./chat-audio-player"
import { useCopyToClipboard } from "@/hooks"
import { Button } from "../ui/button"
import { track } from "@vercel/analytics/react"
import { motion } from "framer-motion"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "../ui/tooltip"

export const ChatActions = ({ content }: { content: string }) => {
  const { isCopied, copyToClipboard } = useCopyToClipboard()
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        duration: 0.5,
        bounce: 0.2,
        damping: 12,
        stiffness: 120,
      }}
      className="absolute -bottom-7 -left-4 mt-2 flex w-fit items-center justify-center rounded-xl border bg-white px-2 py-1 shadow-lg"
    >
      <PlayAudioButton text={content} />
      <Tooltip>
        <TooltipContent>Copy</TooltipContent>
        <TooltipTrigger asChild>
          <Button
            variant="secondary"
            className="bg-transparent"
            size="icon"
            onClick={() => {
              copyToClipboard(content)
            }}
          >
            {isCopied ? (
              <CheckIcon className="size-4" />
            ) : (
              <CopyIcon className="size-4" />
            )}
          </Button>
        </TooltipTrigger>
      </Tooltip>

      {/* <Tooltip>
        <TooltipContent>New Chat</TooltipContent>
        <TooltipTrigger asChild>
          <Button
            variant="secondary"
            className="bg-transparent"
            size="icon"
            onClick={() => {
              track("Chat Actions", { type: "Reload" })
              window.location.reload()
            }}
          >
            <MessageCirclePlusIcon className="size-4" />
          </Button>
        </TooltipTrigger>
      </Tooltip> */}
    </motion.div>
  )
}
