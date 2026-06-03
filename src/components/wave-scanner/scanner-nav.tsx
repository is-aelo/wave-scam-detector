"use client"

import { ArrowLeft } from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"

type ScannerNavProps = {
  onBack?: () => void
  onStart?: () => void
  showBack?: boolean
}

export function ScannerNav({
  onBack,
  onStart,
  showBack = false,
}: ScannerNavProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border-subtle bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[52px] w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-md border border-primary-border bg-primary-dim text-sm font-semibold text-primary">
            W
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-normal">Wave</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {showBack && onBack ? (
            <Button
              variant="ghost"
              size="sm"
              className="rounded-lg text-foreground-muted hover:bg-surface-secondary hover:text-foreground"
              onClick={onBack}
            >
              <ArrowLeft size={14} weight="bold" />
              Back
            </Button>
          ) : onStart ? (
            <Button
              size="sm"
              className="rounded-md border border-primary-border bg-primary-dim px-3 text-xs text-foreground shadow-none hover:bg-primary-dim-hover"
              onClick={onStart}
            >
              Start scan
            </Button>
          ) : null}
        </div>
      </div>
    </header>
  )
}
