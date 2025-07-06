import { StarsIcon } from "lucide-react"
import { AIMessageWrapper } from "./ai-message-wrapper"

export const AISkeletonMessage = ({ label }: { label: string }) => {
  return (
    <AIMessageWrapper>
      <div className="prose w-full max-w-3xl shrink-0 duration-700 animate-in fade-in zoom-in-75">
        <div className="flex w-full justify-between rounded-t-xl border border-b-0 border-gray-200 bg-gray-50 p-2">
          <div className="my-0 flex items-center text-sm">
            <StarsIcon
              strokeWidth={1.5}
              className="ml-1 mr-2 inline size-5 shrink-0 text-gray-500"
            />
            {label}
          </div>
        </div>
        <div className="my-0 space-y-2 rounded-b-3xl border border-gray-200 p-5 antialiased">
          <div className="flex w-full max-w-3xl flex-col gap-4 rounded-lg pt-2">
            <div className="h-5 w-10/12 origin-left animate-gradient rounded-sm bg-linear-to-r from-gray-50 from-30% via-gray-200/60 to-gray-50 bg-2x opacity-0 delay-100"></div>
            <div className="h-5 w-full origin-left animate-gradient rounded-sm bg-linear-to-r from-gray-300/60 via-slate-100 via-30% to-gray-300/60 to-60% bg-2x opacity-0 delay-150 duration-700"></div>
            <div className="duration-600 h-5 w-3/5 origin-left animate-gradient rounded-sm bg-linear-to-r from-gray-50 from-40% via-gray-300/60 to-gray-50 to-70% bg-2x opacity-0 delay-200"></div>
          </div>
        </div>
      </div>
    </AIMessageWrapper>
  )
}
