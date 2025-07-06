import React, { use, useState } from "react"
import { AIMessageWrapper, UserMessage } from "../messages"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { CircleXIcon, XIcon, XSquareIcon } from "lucide-react"
import { useReducer } from "react"

import { v4 as uuidv4 } from "uuid"
import { motion } from "framer-motion"
import { generateId } from "ai"
import { WordsPullUp } from "./words-pull-up"
import { AIAvatar } from "../ai-avatar"

import { UseChatHelpers } from "ai/react/dist"
import { UseAppendMessageHelpers } from "@/hooks/use-append-message"

interface SelectionBadgeProps {
  label: string
  onRemove: () => void
}

export const SelectionBadge = ({ label, onRemove }: SelectionBadgeProps) => (
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
  >
    <Button
      variant="destructive"
      size="sm"
      className="text-nowrap"
      onClick={onRemove}
    >
      {label}
      <XIcon className="ml-2 size-4 shrink-0" />
    </Button>
  </motion.div>
)

interface StepContentProps {
  title: string
  children: React.ReactNode
  skip?: () => void
}

export const StepContent = ({ title, children, skip }: StepContentProps) => (
  // <AIMessageWrapper className="min-h-0">
  <div className="animate-in fade-in flex flex-col items-center justify-center px-2 duration-500">
    <WordsPullUp
      className="max-w-sm tracking-[-0.05em] text-wrap"
      text={title}
    />

    {/* <div className="flex items-center gap-1 mt-1">{title}</div> */}
    <div className="mt-5 flex flex-wrap justify-center gap-2">{children}</div>
    {/* {skip && (
      <Button
        size="sm"
        variant="outline"
        onClick={() => skip()}
        className="mt-6 text-sm cursor-pointer"
      >
        Skip
      </Button>
    )} */}
  </div>
  // </AIMessageWrapper>
)

interface ChatDecisionTreeProps {
  appendMessage: UseAppendMessageHelpers["appendMessage"]
  onAddDetails?: () => void
  setSkip: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ChatDecisionTree({
  appendMessage,
  onAddDetails,
  setSkip,
}: ChatDecisionTreeProps) {
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
      className="no-scrollbar flex flex-col items-center overflow-y-scroll pt-16 md:pt-60"
    >
      <div className="relative mb-4 h-10 w-screen max-w-(--breakpoint-sm) overflow-clip md:w-fit">
        <div className="pointer-events-none absolute top-0 -right-1 z-10 h-10 w-14 bg-linear-to-l from-white to-transparent md:hidden"></div>
      </div>
      <div>
        <div className="animate-in fade-in flex flex-col items-center justify-center px-2 duration-500">
          <WordsPullUp
            className="max-w-sm tracking-[-0.05em] text-wrap"
            text={"BrainrotGPT"}
          />
        </div>
      </div>
    </motion.div>
  )
}
