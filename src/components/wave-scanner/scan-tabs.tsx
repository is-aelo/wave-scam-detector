"use client"

import { ChatCenteredText, LinkSimple } from "@phosphor-icons/react"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { ScanMode } from "@/lib/wave-scan-view"

type ScanTabsProps = {
  value: ScanMode
  onValueChange: (value: ScanMode) => void
}

export function ScanTabs({ value, onValueChange }: ScanTabsProps) {
  return (
    <Tabs
      value={value}
      onValueChange={(nextValue) => onValueChange(nextValue as ScanMode)}
      className="mb-6 w-fit max-w-full"
    >
      <TabsList className="grid h-9 w-fit grid-cols-2 overflow-hidden rounded-lg border border-border-subtle bg-background/40 p-0.5">
        <TabsTrigger
          value="message"
          className="rounded-md px-4 py-1.5 text-xs font-medium text-foreground-subtle data-[state=active]:bg-surface-raised data-[state=active]:text-foreground"
        >
          <ChatCenteredText size={16} weight="duotone" />
          Message
        </TabsTrigger>
        <TabsTrigger
          value="link"
          className="rounded-md px-4 py-1.5 text-xs font-medium text-foreground-subtle data-[state=active]:bg-surface-raised data-[state=active]:text-foreground"
        >
          <LinkSimple size={16} weight="duotone" />
          URL
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
