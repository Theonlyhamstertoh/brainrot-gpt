import { Alert, AlertDescription } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"
import React from "react"

function ErrorAlertMessage() {
  return (
    <div className="m-5 pt-6">
      <Alert className="mx-auto max-w-xl gap-6 rounded-3xl border border-red-100 bg-red-50 text-red-500 shadow-xs">
        <InfoIcon className="size-5 stroke-red-500" />
        <AlertDescription className="">
          An error occured while processing your request. Try refreshing,
          sending another message, or create a new chat. If this issue persists
          please contact us.
        </AlertDescription>
      </Alert>
    </div>
  )
}

export default ErrorAlertMessage
