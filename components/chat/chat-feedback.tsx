"use client"
import { SubmitFeedbackProps, VoteEnums } from "@/types"
import { useState } from "react"
import { XIcon } from "lucide-react"
import { Button } from "../ui/button"
export const ChatFeedback = ({
  setOpenFeedbackModal,
  onSubmitFeedbackHandler,
  voteType,
}: {
  setOpenFeedbackModal: (value: boolean) => void
  onSubmitFeedbackHandler: SubmitFeedbackProps
  voteType: VoteEnums
}) => {
  const [feedback, setFeedback] = useState("")

  const [showTextbox, setShowTextbox] = useState(false)

  const options =
    voteType === "upvote"
      ? ["Solved My Issue", "Easy To Understand", "Correct Answer"]
      : ["Incorrect", "Incomplete"]
  return (
    <form className="mt-6 w-full max-w-2xl rounded-xl border border-gray-100 px-8 py-6">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-gray-600">Provide Feedback:</p>
        <XIcon
          className="inline-block size-5 shrink-0 cursor-pointer rounded-md text-gray-700"
          onClick={() => setOpenFeedbackModal(false)}
        />
      </div>
      <div className="">
        <div className="mt-2 flex flex-wrap gap-3">
          {options.map((option) => (
            <Button
              size={"sm"}
              className="grow"
              variant={"outline"}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onSubmitFeedbackHandler({ feedback: option, voteType })
              }}
              key={option}
            >
              {option}
            </Button>
          ))}
          <Button
            size={"sm"}
            className="grow"
            variant={"outline"}
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
              setShowTextbox(!showTextbox)
            }}
          >
            Other
          </Button>
        </div>
        {showTextbox && (
          <div className="mt-4 space-y-3">
            <input
              type="text"
              placeholder="How did MasterMechanic do?"
              onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFeedback(e.target.value)
              }
              value={feedback}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm tracking-wide outline-hidden transition focus-within:border-gray-400"
            ></input>
            <Button
              variant={"ghost"}
              size="sm"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onSubmitFeedbackHandler({ feedback, voteType })
              }}
              className="text-sm text-gray-500"
            >
              Submit
            </Button>
          </div>
        )}
      </div>
    </form>
  )
}
