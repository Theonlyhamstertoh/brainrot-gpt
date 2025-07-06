"use client"
import { CheckIcon, CopyIcon, StarsIcon } from "lucide-react"
import { AIMessageWrapper } from "./ai-message-wrapper"
import { Button } from "../ui/button"
import { useCopyToClipboard } from "@/hooks"

import { use } from "react"
import { ChatActions, ChatMarkdown } from "../chat"

import { HugeiconsAiContentGenerator02 } from "@/components/icons"

export const AIJobMessage = ({ description }: { description: string }) => {
  const { isCopied, copyToClipboard } = useCopyToClipboard()

  return (
    <AIMessageWrapper className="">
      {/* <div className="w-full max-w-3xl prose duration-700 rounded-3xl bg-stone-100 animate-in fade-in zoom-in-75"> */}
      {/* <div className="flex justify-between w-full p-2 bg-transparent border-b-0 border-gray-200 rounded-t-3xl"> */}
      <div className="my-2 flex items-center justify-between">
        <span className="text-md flex items-center gap-2 font-semibold text-stone-900">
          <HugeiconsAiContentGenerator02 className="size-6 shrink-0 text-blue-500" />
          Job Summary
        </span>
        <Button
          variant="secondary"
          className="bg-transparent"
          size="icon"
          onClick={() => copyToClipboard(description)}
        >
          {isCopied ? (
            <CheckIcon className="size-5" />
          ) : (
            <CopyIcon className="size-5" />
          )}
        </Button>
      </div>
      {/* </div> */}
      <ChatMarkdown content={description} />
      {/* <ChatActions content={description} /> */}
      {/* <div className="p-5 pb-2 my-0 border-gray-200 rounded-b-3xl bg-stone-100">
        {description}
        <p className="text-xs text-gray-600">
          {company.name} can make mistakes, check responses
        </p>
      </div> */}
      {/* </div> */}
    </AIMessageWrapper>
  )
}
