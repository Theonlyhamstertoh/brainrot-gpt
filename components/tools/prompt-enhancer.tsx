import { enhancePromptFromUserMessage } from "@/lib/api/openai"
import {
  HeroiconsArrowUturnLeft16Solid,
  HugeiconsAiMagic,
} from "@/components/icons"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { usePromptEnhancerStore } from "@/store/use-enhancing-store"
import { UseChatHelpers } from "@ai-sdk/react"
import { Fallback } from "@radix-ui/react-avatar"
import ansis from "ansis"
import React, { useEffect, useState } from "react"
import toast from "react-hot-toast"

function PromptEnhancerButton({
  input,
  setInput,
}: Pick<UseChatHelpers, "input" | "setInput">) {
  const [oldInput, setOldInput] = useState("")
  const [aiInput, setAiInput] = useState("")
  const [used, setUsed] = useState(false)
  const { isEnhancing, setEnhancing } = usePromptEnhancerStore()

  const isDisabled = input.trim().split(/\s+/).length < 3 || isEnhancing
  const tooltipContent = isDisabled
    ? "This prompt is too short to enhance"
    : "Enhance prompt"

  useEffect(() => {
    if (!used || !aiInput) return

    // if user edits the input after enhancement
    if (input !== aiInput && input !== oldInput) {
      console.log("RESETTING USED BUTTON")
      setOldInput("")
      setAiInput("")
      setUsed(false)
    }
  }, [used, input])
  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      setEnhancing(true)
      setOldInput(input)
      setUsed(true)

      const newInput = await enhancePromptFromUserMessage({ input })
      setInput(newInput) // to update the chat-input field directly
      setAiInput(newInput)
    } catch (err) {
      console.error("Prompt enhancement failed", err)
      toast.error("Prompt enhancement failed")
    } finally {
      setEnhancing(false)
    }
  }

  const undoEnhance = () => {
    setUsed(false)
    setInput(oldInput)
    setOldInput("")
    setAiInput("")
  }

  if (used) {
    return (
      <Button
        onClick={undoEnhance}
        variant={"secondary"}
        size={"icon"}
        disabled={isDisabled}
        className={
          "group mr-2 h-9 w-fit shrink-0 items-center gap-1 rounded-full bg-stone-100 px-2 hover:cursor-pointer disabled:cursor-not-allowed"
        }
      >
        <HeroiconsArrowUturnLeft16Solid
          className={`size-4 text-stone-700 group-disabled:text-stone-300`}
        />
        Undo
      </Button>
    )
  }
  return (
    <Tooltip>
      <TooltipContent>{tooltipContent}</TooltipContent>
      <TooltipTrigger asChild>
        <Button
          onClick={handleSubmit}
          variant={"secondary"}
          size={"icon"}
          disabled={isDisabled}
          className={
            "group mr-2 size-9 shrink-0 rounded-full bg-transparent hover:cursor-pointer disabled:cursor-not-allowed"
          }
        >
          <HugeiconsAiMagic
            className={`size-5 text-stone-700 group-disabled:text-stone-300`}
          />
        </Button>
      </TooltipTrigger>
    </Tooltip>
  )
}

export default PromptEnhancerButton
