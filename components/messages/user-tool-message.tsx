"use client"
import {
  CheckCheckIcon,
  CheckIcon,
  DotIcon,
  LoaderIcon,
  MessageCircleIcon,
  MousePointer2Icon,
  MousePointerIcon,
  SearchIcon,
  StarsIcon,
} from "lucide-react"
import React, { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/utils"

export const UserToolMessage = ({
  children,
  isLoading,
}: {
  children: React.ReactNode
  isLoading?: boolean
}) => {
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
      className="m-5 flex h-fit justify-end"
    >
      <div
        className={cn(
          "prose flex w-fit max-w-xl items-center justify-end rounded-3xl bg-black p-2 px-5 font-semibold italic text-white duration-700 animate-in"
        )}
      >
        <motion.div
          initial={{ scale: 0, y: 30 }}
          animate={{ scale: 1, y: 0 }}
          transition={{
            y: {
              type: "spring",
              duration: 0.4,
              bounce: 0.2,
            },
            scale: {
              type: "spring",
              duration: 0.5,
              bounce: 0.5,
            },
            // rotate: {
            //   duration: 1,
            //   repeat: 4,
            //   ease: "linear",
            // },
          }}
          className="mr-2"
        >
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loader"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <LoaderIcon className="size-4 animate-spin" strokeWidth={2.5} />
              </motion.div>
            ) : (
              <motion.div
                key="dot"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <CheckCheckIcon strokeWidth={2.5} className="size-4" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {children}
      </div>
    </motion.div>
  )
}
