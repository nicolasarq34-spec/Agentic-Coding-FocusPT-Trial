import * as React from "react"
import { cn } from "cn"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        // Same surface, border and padding as Input. Several lines can't be a pill, so it uses the card radius.
        // field-sizing-content: the box grows with the text instead of scrolling inside itself.
        "flex field-sizing-content min-h-24 w-full rounded-md border border-input bg-card px-4 py-2.5 pointer-coarse:px-5 pointer-coarse:py-3",
        // 16px text everywhere, like Input: iPhones zoom into smaller text when it's tapped.
        "text-base transition-colors outline-none placeholder:text-muted-foreground",
        "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
