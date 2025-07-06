import React from "react"
import { motion } from "framer-motion"
import { AIAvatar } from "../ai-avatar"
import { cn } from "@/lib/utils"
import { WordsPullUp } from "../chat/words-pull-up"
import { useIsMobile } from "@/hooks/use-mobile"
import { Disclaimer } from "../disclaimer"

export const AIMessageWrapper = ({
  children,
  className,
  isLast,
  isLoading,
  name = "MasterMechanic",
  hideDisclaimer = false,
}: {
  children: React.ReactNode
  className?: string
  isLast?: boolean
  isLoading?: boolean
  name?: string
  hideDisclaimer?: boolean
}) => {
  const isMobile = useIsMobile()

  return (
    <div className={cn("relative z-0 min-h-40 p-5")}>
      <div
        className={cn("flex flex-col items-start gap-5 sm:gap-3 md:flex-row")}
      >
        {(!isMobile || (isMobile && isLast)) && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0 }}
            animate={{
              opacity: 1,
              y: isLoading ? 5 : 0,
              scale: isLoading ? 0.8 : 1,
            }}
            transition={{
              type: "spring",
              duration: 0.5,
              bounce: 0.8,
              damping: 12,
              stiffness: 160,
            }}
            className="flex items-center gap-2"
          >
            {/* <AIAvatar /> */}
            {isMobile && (
              <span
                className={cn(
                  isLoading && "animate-pulse",
                  "font-black tracking-tight text-orange-600 md:hidden"
                )}
              >
                {isLoading ? "💥 Exploding..." : name}
              </span>
            )}
          </motion.div>
        )}

        {/* Explosion Message Bubble */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.8 }}
          animate={{
            opacity: 1,
            y: 0,
            scale: isLoading ? 1.05 : 1,
            rotate: isLoading ? 1 : 0,
          }}
          transition={{
            type: "spring",
            duration: 0.5,
            bounce: 0.2,
            damping: 12,
            stiffness: 120,
          }}
          className="relative w-full md:min-w-0 md:grow"
        >
          {/* Main Bubble Shape */}
          <div className="relative z-0">
            {/* Outer bubble border */}
            <div className="absolute inset-0 z-0 scale-105 transform rounded-3xl bg-black" />

            {/* Inner bubble fill */}
            <motion.div
              className="relative z-0 flex min-h-[120px] items-center justify-center rounded-3xl bg-gradient-to-br from-yellow-300 via-orange-400 to-red-500 p-6"
              animate={{
                boxShadow: isLoading
                  ? "0 0 30px rgba(255, 165, 0, 0.8), 0 0 60px rgba(255, 69, 0, 0.4)"
                  : "0 0 20px rgba(255, 165, 0, 0.5)",
              }}
              transition={{ duration: 0.3 }}
            >
              {/* Halftone pattern overlay */}
              <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_2px_2px,black_1px,transparent_0)] bg-[length:8px_8px] opacity-15" />

              {/* Message Content */}
              <div className="relative z-0 w-full">
                <div
                  className={cn(
                    "font-bold text-black drop-shadow-sm",
                    className
                  )}
                >
                  {children}
                </div>
              </div>

              {/* Loading pulse effect */}
              {isLoading && (
                <motion.div
                  className="absolute inset-0 z-0 rounded-3xl bg-yellow-200"
                  animate={{
                    opacity: [0, 0.3, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              )}
            </motion.div>
          </div>

          {/* Explosion particles */}
          <div className="pointer-events-none absolute inset-0 -z-10">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-2 w-2 rounded-full bg-yellow-400"
                animate={{
                  scale: isLoading ? [1, 1.5, 1] : [0.8, 1, 0.8],
                  opacity: [0.4, 0.8, 0.4],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
                style={{
                  top: `${15 + Math.random() * 70}%`,
                  left: `${10 + Math.random() * 80}%`,
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
