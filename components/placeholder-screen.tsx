import Image from "next/image"
import Link from "next/link"
import clsx from "clsx"
import { bungee } from "@/app/fonts"
import { cn } from "@/lib/utils"
import { MasterMechanic } from "./icons"

export const PlaceholderScreen = ({
  className = "",
  children,
}: {
  className?: string
  children: React.ReactNode
}) => {
  return (
    <div
      className={cn(
        `flex h-full w-full flex-col items-center justify-center gap-3`,
        className
      )}
    >
      <div className="relative h-48 w-48 sm:h-56 sm:w-56">
        <Image
          fill
          className="bounce-smooth shrink-0 -translate-y-6 object-contain"
          src="/assets/bluon-robot.svg"
          alt="BluonAI Logo"
          priority
        />
      </div>

      <MasterMechanic className="w-72 sm:w-80" />

      <div className="w-full">{children}</div>
    </div>
  )
}
