import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "cn"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        // Pill like the buttons, same heights: 40px with a mouse, 48px for a finger.
        "h-10 w-full min-w-0 rounded-full border border-input bg-card px-4 pointer-coarse:h-12 pointer-coarse:px-5",
        // 16px text: iPhones zoom into any input with smaller text when it's tapped.
        "text-base transition-colors outline-none placeholder:text-muted-foreground",
        "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
        className
      )}
      {...props}
    />
  )
}

export { Input }
