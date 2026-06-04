"use client"

import { EnvelopeSimple, LinkedinLogo, TiktokLogo } from "@phosphor-icons/react"

export function DevContact() {
  return (
    <div className="dev-contact flex items-center gap-2.5">
      <a
        href="mailto:talingting.eloise@gmail.com"
        className="flex h-7 w-7 items-center justify-center rounded-md text-foreground-muted transition-colors hover:bg-surface-secondary hover:text-foreground"
        title="Email"
      >
        <EnvelopeSimple size={14} weight="bold" />
      </a>
      <a
        href="https://www.linkedin.com/in/eloisetalingting/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-7 w-7 items-center justify-center rounded-md text-foreground-muted transition-colors hover:bg-surface-secondary hover:text-foreground"
        title="LinkedIn"
      >
        <LinkedinLogo size={14} weight="bold" />
      </a>
      <a
        href="https://www.tiktok.com/@is_aelo"
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-7 w-7 items-center justify-center rounded-md text-foreground-muted transition-colors hover:bg-surface-secondary hover:text-foreground"
        title="TikTok"
      >
        <TiktokLogo size={14} weight="bold" />
      </a>
    </div>
  )
}
