"use client"
import clsx from "clsx"
import TextAreaAutoResize from "react-textarea-autosize"
import React, {
  KeyboardEvent,
  use,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import { ArrowUpIcon, CircleIcon, FeatherIcon, UserIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { cn, formatSeconds, isNonEmptyString } from "@/lib/utils"
import toast from "react-hot-toast"

import { Textarea } from "../ui/textarea"
import { LayoutGroup, motion } from "framer-motion"
import { Tooltip, TooltipContent } from "../ui/tooltip"
import { TooltipTrigger } from "@radix-ui/react-tooltip"

import { useIsMobile } from "@/hooks/use-mobile"
import { useAudioRecorder } from "@/hooks/use-voice-recorder"
import {
  AppendMessageOptions,
  UseAppendMessageHelpers,
} from "@/hooks/use-append-message"
import ChatVoiceRecorder from "@/components/chat/chat-voice-recorder"
import { UseChatHelpers } from "@ai-sdk/react"

type ChatInputProps = Pick<
  UseChatHelpers,
  | "id"
  | "handleSubmit"
  | "messages"
  | "input"
  | "setInput"
  | "stop"
  | "handleInputChange"
  | "status"
> & { appendMessage: UseAppendMessageHelpers["appendMessage"] }

export const ChatInput = ({
  status,
  messages,
  input,
  setInput,
  appendMessage,
  id,
  handleInputChange,
}: ChatInputProps) => {
  const isLoading = status === "streaming"
  const isReady = status === "ready"
  const formRef = useRef<HTMLFormElement>(null)

  const isMobile = useIsMobile()
  const {
    recording,
    startRecording,
    stopRecording,
    isTranscribing,
    seconds,
    text,
    clearRecording,
    saveRecording,
  } = useAudioRecorder()

  const textAreaRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    // autofocus chat input if user presses a key
    const onKeyDown = (event: WindowEventMap["keydown"]) => {
      if (
        textAreaRef.current &&
        !event.ctrlKey &&
        !event.metaKey &&
        event.key.length == 1 &&
        document.activeElement !== textAreaRef.current
      ) {
        textAreaRef.current.focus()
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => {
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [])

  const onKeyDownHandler = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    // if chat is loading, ignore keydown events

    if (isLoading) return
    // If key === "Enter", submit the form
    if (event.key === "Enter" && !event.shiftKey) {
      if (isNonEmptyString(input)) {
        event.preventDefault()
        event.stopPropagation()
        formRef.current?.requestSubmit()
      }
    }
  }

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      // Track message sent for regular input

      appendMessage({ content: input })
      setInput("")
      return
    } catch (err) {
      console.log(err)
      toast.error("There was an error.")
    }
  }

  const handleSaveRecording = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault()
    e.stopPropagation()
    console.log("handleSaveRecording Called")
    try {
      if (recording) {
        console.log("Recording active, stopping first...")
        const text = await saveRecording()

        if (text) {
          setInput(text)
          toast.success("Audio transcribed successfully")

          clearRecording()
        }
      }
    } catch (error) {
      toast.error("Transcription failed")
      console.error(error)
    }
  }

  useEffect(() => {
    const textarea = textAreaRef.current
    if (!textarea) return

    // Function to adjust height
    const adjustHeight = () => {
      // Reset the height to calculate the actual scrollHeight
      textarea.style.height = "auto"

      // Calculate the line height (approximate)
      const lineHeight = 24 // Adjust this based on your actual line height

      // Calculate max height (12 rows * line height)
      const maxHeight = lineHeight * 12

      const newHeight = Math.min(textarea.scrollHeight, maxHeight)
      textarea.style.height = `${newHeight}px`

      // Add scrollbar if content exceeds max height
      textarea.style.overflowY =
        textarea.scrollHeight > maxHeight ? "auto" : "hidden"
    }

    // Call adjustHeight when content changes
    adjustHeight()

    // Set up an event listener for input changes
    const handleInput = () => adjustHeight()
    textarea.addEventListener("input", handleInput)

    // Clean up
    return () => {
      textarea.removeEventListener("input", handleInput)
    }
  }, [input, text]) // Re-run when input or transcript changes

  return (
    <form
      onSubmit={onSubmitHandler}
      ref={formRef}
      className="bg-whi relative z-50 w-full max-w-3xl flex-col items-center justify-center gap-2"
    >
      {/* <div className="flex items-center justify-between w-full py-2 pl-6 pr-2 text-xs font-medium text-white font-dm"> */}
      {/* Bluon AI just updated to 3.0! */}
      {/* <XIcon className="text-black size-4" /> */}
      {/* <div className="p-1 px-3 border rounded-full">What is r-22</div> */}
      {/* { questionModel && (
          <div className="flex gap-2 px-2 py-2 m-1 mb-4 overflow-x-scroll no-scrollbar">
            <ChatInputModel
              key={"question-model-" + questionModel.id}
              model={questionModel}
              removeModel={resetQuestionModel}
            />
          </div>
        )} */}
      {/* </div> */}
      <LayoutGroup>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          layout
          transition={{
            // this springs opacity & position
            default: {
              type: "spring",
              stiffness: 120,
              damping: 12,
              bounce: 0.3,
            },
            // this springs layout (height/width)
            layout: {
              type: "spring",
              stiffness: 120,
              damping: 12,
              bounce: 3,
            },
          }}
          className={cn(
            `relative flex w-full flex-col overflow-clip rounded-[1.75rem] border border-stone-200 bg-white shadow-lg shadow-stone-200 transition focus-within:shadow-lg focus-within:shadow-stone-300`,
            recording && `border-stone-500 shadow-stone-200`
          )}
        >
          <div className="flex w-full flex-col gap-2">
            {recording || isTranscribing ? (
              <motion.div
                key="recording"
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex h-12 w-full items-center justify-between bg-linear-to-b from-stone-200 to-white p-3 px-6 text-sm text-stone-700"
              >
                <span className="font-medium">Recording voice</span>
                <div className="flex items-center gap-2">
                  <CircleIcon className="size-2 animate-pulse fill-red-500 text-red-500" />
                  {formatSeconds(seconds)}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="textarea"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <Textarea
                  ref={textAreaRef}
                  rows={1}
                  placeholder={
                    recording
                      ? "Listening to voice..."
                      : messages.length === 0
                        ? "Start typing or talking..."
                        : "Ask follow-up"
                  }
                  value={input}
                  onChange={handleInputChange}
                  disabled={recording}
                  className={cn(
                    // "max-h-[calc(75dvh)] min-h-[24px] resize-none overflow-hidden bg-transparent pb-10 text-base! dark:border-zinc-700"
                    `no-scrollbar disabled:animate-loading w-full grow-0 resize-none overflow-y-scroll border-none bg-transparent px-5 py-4 pb-0 text-base! text-stone-950 antialiased ring-transparent outline-hidden transition placeholder:text-stone-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-0 disabled:cursor-wait disabled:bg-linear-to-r disabled:bg-size-[200%_100%] disabled:bg-clip-text disabled:text-transparent`
                  )}
                  onKeyDown={onKeyDownHandler}
                ></Textarea>
              </motion.div>
            )}
          </div>
          <div className="m-3 flex h-9 items-end justify-center">
            {/* <DropdownMenuSeparator /> */}
            {/* </VisuallyHidden> */}
            <div className="no-scrollbar font-dm flex h-full w-full items-center gap-1 overflow-x-scroll px-2 text-sm text-black">
              {/* Bluon AI just updated to 3.0! */}
              {/* <XIcon className="text-black size-4" /> */}
              {/* <div className="p-1 px-3 border rounded-full">Job Summary</div> */}
              {/* <div className="flex items-center gap-2 p-1 px-3 border border-yellow-300 rounded-full bg-yellow-50">
                <ScanBarcodeIcon className="size-4" /> Nameplate
              </div> */}
              {/* <div className="p-1 px-3 border rounded-full">What is r-22</div> */}
            </div>
            <div className="flex grow justify-end">
              {/* <PromptEnhancerButton input={input} setInput={setInput} /> */}
              <ChatVoiceRecorder
                handleSaveRecording={handleSaveRecording}
                startRecording={startRecording}
                stopRecording={stopRecording}
                isTranscribing={isTranscribing}
                recording={recording}
                isLoading={isLoading}
                clearRecording={clearRecording}
              />
              {!recording && !isTranscribing && (
                <Tooltip>
                  <TooltipContent>Send</TooltipContent>
                  <TooltipTrigger asChild>
                    <Button
                      type="submit"
                      variant={"default"}
                      disabled={
                        recording ||
                        isTranscribing ||
                        isLoading ||
                        !isNonEmptyString(input)
                      }
                      className={`grid size-9 shrink-0 place-items-center rounded-full text-white transition-all hover:cursor-pointer enabled:hover:ring-2 disabled:bg-stone-100 disabled:hover:cursor-not-allowed`}
                    >
                      <ArrowUpIcon className="size-5" />
                    </Button>
                  </TooltipTrigger>
                </Tooltip>
              )}
            </div>
          </div>
        </motion.div>
      </LayoutGroup>
    </form>
  )
}
