"use client"

import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

import { useDebouncedCallback } from "use-debounce"
import { getModels } from "@/lib/api/bluon"
import { BluonModel } from "@/types"
import { track } from "@vercel/analytics"
import toast from "react-hot-toast"
import { useChatStore } from "@/store/use-chat-store"
import React, { useState } from "react"
import { DialogDescription, type DialogProps } from "@radix-ui/react-dialog"
import * as VisuallyHidden from "@radix-ui/react-visually-hidden"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Command } from "../ui/command"
import Image from "next/image"

interface CommandDialogProps extends DialogProps {}

export const ChatSearchBar = ({ children, ...props }: CommandDialogProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [models, setModels] = useState<BluonModel[] | null>(null)
  const [setSelectedModel, openSearchBar, setOpenSearchBar] = useChatStore(
    (s) => [s.setSelectedModel, s.openSearchBar, s.setOpenSearchBar]
  )

  const debounced = useDebouncedCallback(async (value) => {
    if (value.length < 3) return
    const { data: models, error } = await getModels(value)
    if (error) {
      track("Error", { type: error.message })
      setIsLoading(false)
      return toast.error("There was an error with getting models.")
    }
    if (models) {
      setModels(models.data)
      setIsLoading(false)
    }
  }, 300)
  const handleSelection = (model: BluonModel) => {
    setSelectedModel(model)
    setOpenSearchBar(false)
  }

  const handleInputChange = (value: string) => {
    if (value.length >= 3) {
      setIsLoading(true)
    } else {
      setIsLoading(false)
    }
    if (models !== null) setModels(null)
    debounced(value)
  }

  return (
    <Dialog {...props} open={openSearchBar} onOpenChange={setOpenSearchBar}>
      <DialogTitle>
        <VisuallyHidden.Root>Model Searchbar</VisuallyHidden.Root>
      </DialogTitle>
      <DialogDescription>
        <VisuallyHidden.Root>
          This searchbar takes in model number and returns a list of models that
          matches your input. Please input at least 3 characters.
        </VisuallyHidden.Root>
      </DialogDescription>
      <DialogContent className="h-dvh overflow-hidden p-0 shadow-lg sm:h-[300px]">
        <Command
          shouldFilter={false}
          className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5"
        >
          <CommandInput
            placeholder="Type a command or search..."
            onValueChange={handleInputChange}
          />

          <SearchResults
            models={models}
            loading={isLoading}
            handleSelection={handleSelection}
          />
        </Command>
      </DialogContent>
    </Dialog>
  )
}

const SearchResults = ({
  models,
  handleSelection,
  loading,
}: {
  models: BluonModel[] | null
  handleSelection: (model: BluonModel) => void
  loading: boolean
}) => {
  const hasFetched = !!models
  const hasResults = hasFetched && models.length >= 1

  return (
    <CommandList className="">
      {!loading && !hasFetched && (
        <CommandEmpty className="text-gray-600">
          Start typing at least 3 characters to search.
        </CommandEmpty>
      )}
      {hasFetched && !hasResults && (
        <CommandEmpty className="text-gray-600">No results found.</CommandEmpty>
      )}
      {loading && (
        <CommandEmpty className="text-gray-600">Loading...</CommandEmpty>
      )}
      {hasResults && (
        <CommandGroup heading="Models">
          {models.map((model) => {
            return (
              <CommandItem
                value={model.model}
                key={model.id}
                onSelect={() => handleSelection(model)}
                className="flex gap-2 hover:cursor-pointer"
              >
                <Image
                  src={model.brand_image}
                  width="240"
                  className="w-12 mix-blend-multiply"
                  quality={100}
                  height="180"
                  alt="Model Brand Logo"
                />
                <Image
                  src={model.series.image.url}
                  width="100"
                  className="size-8 mix-blend-multiply"
                  quality={88}
                  height="100"
                  alt="Model Brand Logo"
                />
                <div className="ml-3">
                  {model.model}
                  <p className="ml-auto text-gray-500">{model.model_notes}</p>
                </div>
              </CommandItem>
            )
          })}
        </CommandGroup>
      )}
    </CommandList>
  )
}
