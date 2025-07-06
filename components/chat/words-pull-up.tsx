"use client"
import { cn } from "@/lib/utils"
import { motion, useInView } from "framer-motion"
import * as React from "react"

export function WordsPullUp({
  text,
  className = "",
}: {
  text: string
  className?: string
}) {
  const splittedText = text.split(" ")

  const pullupVariant = {
    initial: { y: 20, opacity: 0 },

    animate: (i: number) => ({
      y: 0,
      opacity: 1,

      transition: {
        delay: i * 0.1,
        duration: 0.1,
      },
    }),
  }
  const ref = React.useRef(null)
  const isInView = useInView(ref, { once: true })
  return (
    <div className="mx-auto flex flex-wrap justify-center">
      {splittedText.map((current, i) => (
        <motion.div
          key={i}
          ref={ref}
          variants={pullupVariant}
          initial="initial"
          animate={isInView ? "animate" : ""}
          custom={i}
          className={cn(
            "font-dm text-center text-3xl font-semibold md:text-6xl md:leading-16",
            "pr-1.5", // class to sperate words
            className
          )}
        >
          {current == "" ? <span>&nbsp;</span> : current}
        </motion.div>
      ))}
    </div>
  )
}
