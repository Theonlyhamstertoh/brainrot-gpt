"use client"
import { cn } from "@/lib/utils"
import { AIAvatar } from "../ai-avatar"

import { use } from "react"
import { motion } from "framer-motion"
import { WordsPullUp } from "./words-pull-up"

export const ChatLoading = ({
  className,

  label = "Thinking",
}: {
  className?: string
  label?: string
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
      className={cn(
        "animate-enter animate-in flex h-40 gap-4 p-5 duration-500 md:gap-6",
        className
      )}
    >
      <div role="status" className="relative h-fit">
        <motion.svg
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            damping: 40,
            stiffness: 150,
            duration: 1, // Adjust the duration of one full spin
            ease: [0.42, 0, 0.58, 1], // Smooth easing for a gentler spi
          }}
          aria-hidden="true"
          className={`size-9 fill-stone-600 text-gray-200 dark:text-gray-600`}
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
            strokeDasharray="200"
            strokeWidth="2"
          />
        </motion.svg>
        <div className="absolute-center">
          <motion.div
            initial={{ rotate: 50, scale: 0.4 }}
            animate={{ rotate: 0, scale: 0.5 }}
            transition={{
              duration: 0.4, // Duration of the scale/opacity animation
              ease: "easeOut", // Smooth easing for scale/opacity
            }}
          >
            <AIAvatar />
          </motion.div>
        </div>
        <span className="sr-only">Loading...</span>
      </div>

      <div className="mt-1 flex h-fit animate-pulse items-center gap-1 duration-1000">
        <span className="">{label}</span>
        {/* <WordsPullUp text={label} className="pr-1 text-base! font-normal" /> */}
        <InfiniteWave />
      </div>
    </motion.div>
  )
}

const InfiniteWave = () => {
  return (
    <motion.div className="flex h-8 w-6 items-center justify-around">
      {[1, 2, 3].map((index) => (
        <motion.span
          key={index}
          className="block size-1 rounded-sm bg-black"
          animate={{
            y: ["0%", "100%", "0%"],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.2, // Stagger the animations
          }}
        />
      ))}
    </motion.div>
  )
}
