"use client"
import { HugeiconsPencilEdit02 } from "@/components/icons"
import { buttonVariants } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useDecisionTreeStore } from "@/store/use-decision-tree-store"
import Link from "next/link"

export const SidebarToggle = () => {
  const resetDecisionTree = useDecisionTreeStore((s) => s.reset)

  return (
    <>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <SidebarTrigger className="m-3 mr-2" />
        </TooltipTrigger>
        <TooltipContent align="start">Toggle Sidebar</TooltipContent>
      </Tooltip>

      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Link
            onClick={resetDecisionTree}
            href="/chat"
            className={cn(
              buttonVariants({
                variant: "ghost",
                size: "icon",
                className: "mr-2",
              })
            )}
          >
            <HugeiconsPencilEdit02 className="size-6 text-stone-700" />
          </Link>
        </TooltipTrigger>
        <TooltipContent align="start">New Chat</TooltipContent>
      </Tooltip>
    </>
  )
}
