import { cn } from "@/lib/utils"

export function DividerLabel({
  className,
  children,
}: {
  className?: string
  children: string
}) {
  return (
    <div
      className={cn(
        "mb-2.5 flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-widest text-foreground-subtle",
        className,
      )}
    >
      <span className="h-px flex-1 bg-border-subtle" />
      {children}
      <span className="h-px flex-1 bg-border-subtle" />
    </div>
  )
}
