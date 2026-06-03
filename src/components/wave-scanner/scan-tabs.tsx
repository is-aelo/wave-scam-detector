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
      style={{
        display: "flex",
        borderBottom: "0.5px solid var(--border-subtle)",
        marginBottom: 24,
      }}
    >
      {tabs.map(({ value: tabValue, label, Icon }) => {
        const active = value === tabValue
        return (
          <button
            key={tabValue}
            role="tab"
            aria-selected={active}
            onClick={() => onValueChange(tabValue)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "10px 18px",
              fontSize: 13,
              fontWeight: active ? 500 : 400,
              color: active ? "var(--foreground)" : "var(--foreground-subtle)",
              background: "transparent",
              border: "none",
              borderBottom: active ? "1.5px solid var(--foreground)" : "1.5px solid transparent",
              marginBottom: -0.5,
              cursor: "pointer",
              transition: "color 0.15s ease, border-color 0.15s ease",
            }}
          >
            <Icon size={14} weight={active ? "fill" : "regular"} />
            {label}
          </button>
        )
      })}
    </div>
  )
}