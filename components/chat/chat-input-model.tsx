import { Button } from "../ui/button"
import { XIcon } from "lucide-react"
import { ModelItem } from "./chat-sheet/model-list"
import { BluonModel } from "@/types"

export const ChatInputModel = ({
  model,
  removeModel,
}: {
  model: BluonModel
  removeModel: () => void
}) => {
  return (
    <div className="group relative mt-2 w-fit shrink-0 border-spacing-8 cursor-pointer rounded-2xl border border-stone-200 bg-white p-1 px-4 shadow-lg ring-transparent transition ease-out animate-in zoom-in hover:shadow-lg hover:ring-2 hover:ring-blue-500 hover:ring-offset-2 focus:bg-blue-50">
      <ModelItem
        data={model}
        className="p-1"
        // onModelClick={handleModelSelection}
      />
      {/* <ModelItem data={model} className="p-1" /> */}
      <Button
        variant={"destructive"}
        size={"icon"}
        onClick={removeModel}
        className="absolute -right-2 -top-2 size-5 rounded-full border border-gray-300 bg-white text-gray-500 hover:border-red-600 hover:bg-red-500 hover:text-white"
      >
        <XIcon className="size-3" />
      </Button>
    </div>
  )
}
