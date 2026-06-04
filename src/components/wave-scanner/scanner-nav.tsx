"use client"

import { DevContact } from "@/components/wave-scanner/dev-contact"

export function ScannerNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border-subtle bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[52px] w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="/" className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-md border border-primary-border bg-primary-dim text-sm font-bold text-primary">
            W
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold">Wave</p>
          </div>
        </a>

        <DevContact />
      </div>
    </header>
  )
}
