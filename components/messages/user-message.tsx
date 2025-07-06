import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"

export const UserMessage = ({
  children,
  className,
  isLoading,
}: {
  children: React.ReactNode
  className?: string
  isLoading?: boolean
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        duration: 0.8,
        bounce: 0.2,
        damping: 12,
        stiffness: 120,
      }}
      className="m-5 flex h-fit justify-end"
    >
      <div
        className={cn(
          "prose animate-in flex w-fit max-w-xl flex-col items-end justify-end rounded-3xl bg-stone-950 p-3 px-5 text-xl text-white duration-700",
          className
        )}
      >
        {children}
      </div>
    </motion.div>
  )
}
