import { HugeiconsPencilEdit02 } from "@/components/icons"
import { SidebarToggle } from "@/components/sidebar-toggle"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { EditIcon } from "lucide-react"
import Link from "next/link"
export default function ChatHeader({ title }: { title: string | undefined }) {
  return (
    <div className="flex items-center flex-none bg-transparent">
      <SidebarToggle />

      {title && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="pr-8 font-medium truncate text-stone-900"
        >
          {title}
        </motion.div>
      )}
    </div>
  )
}
