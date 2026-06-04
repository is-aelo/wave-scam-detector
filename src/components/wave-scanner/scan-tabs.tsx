"use client"

import { ChatCircleText, LinkSimple } from "@phosphor-icons/react"
import type { ScanMode } from "@/lib/wave-scan-view"

type ScanTabsProps = {
  value: ScanMode
  onValueChange: (value: ScanMode) => void
}

const tabs: { value: ScanMode; label: string; Icon: typeof ChatCircleText }[] = [
  { value: "message", label: "Message", Icon: ChatCircleText },
  { value: "link", label: "URL", Icon: LinkSimple },
]

export function ScanTabs({ value, onValueChange }: ScanTabsProps) {
  return (
    <div
      role="tablist"
      className="mb-5 flex w-full rounded-xl border border-border bg-surface p-1 sm:mb-6"
    >
      {tabs.map(({ value: tabValue, label, Icon }) => {
        const active = value === tabValue
        return (
          <button
            key={tabValue}
            role="tab"
            aria-selected={active}
            onClick={() => onValueChange(tabValue)}
            className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-150 ${
              active
                ? "bg-background-elevated text-foreground shadow-[var(--shadow-elevation-low)]"
                : "text-foreground-muted hover:text-foreground"
            }`}
          >
            <Icon size={15} weight={active ? "fill" : "bold"} />
            {label}
          </button>
        )
      })}
    </div>
  )
}
