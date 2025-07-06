import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "transition cursor-pointer  text-xs sm:text-sm rounded-md font-dm   flex justify-center items-center disabled:opacity-75 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default:
          "relative overflow-hidden group enabled:hover:ring-2 enabled:hover:ring-offset-2 ease-out enabled:hover:bg-linear-to-r bg-stone-900 enabled:hover:from-stone-800 enabled:hover:to-stone-700 text-sm  text-stone-50 enabled:hover:ring-stone-900",
        destructive:
          "bg-primary text-primary-foreground hover:bg-red-600 ease-out hover:ring-2 hover:ring-offset-2 hover:ring-red-600 ",
        outline:
          "border rounded-md font-normal hover:border-blue-500 hover:bg-stone-50 px-2 py-1 text-sm text-stone-800 hover:cursor-pointer  ",
        // secondary: "bg-secondary text-secondary-foreground hover:bg-gray-200",
        secondary:
          " bg-stone-100 text-gray-950  font-medium  hover:cursor-pointer enabled:hover:bg-stone-100 relative overflow-hidden  group enabled:hover:ring-2 hover:ring-offset-2 ease-out  hover:ring-blue-500",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-3   py-2",
        sm: "h-8 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "size-7 rounded-md ",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
