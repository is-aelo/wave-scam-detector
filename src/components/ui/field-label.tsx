import type { LabelHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

export function FieldLabel({
  className,
  children,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-foreground-subtle",
        className,
      )}
      {...props}
    >
      {children}
    </label>
  )
}
