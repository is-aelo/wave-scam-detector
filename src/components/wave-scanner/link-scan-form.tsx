"use client"

import { useState, type FormEvent } from "react"
import { PaperPlaneTilt } from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FieldLabel } from "@/components/ui/field-label"
import { RateLimitBadge } from "@/components/ui/rate-limit-badge"

type LinkScanFormProps = {
  urlText: string
  urlSource: string
  urlContext: string
  urlEvidence: string
  loading: boolean
  rateLimited: boolean
  onUrlTextChange: (value: string) => void
  onUrlSourceChange: (value: string) => void
  onUrlContextChange: (value: string) => void
  onUrlEvidenceChange: (value: string) => void
  onAttachmentChange?: (file: File | null) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

export function LinkScanForm({
  urlText,
  urlSource,
  urlContext,
  urlEvidence,
  loading,
  rateLimited,
  onUrlTextChange,
  onUrlSourceChange,
  onUrlContextChange,
  onUrlEvidenceChange,
  onAttachmentChange,
  onSubmit,
}: LinkScanFormProps) {
  const [attachmentName, setAttachmentName] = useState("")

  return (
    <form
      onSubmit={onSubmit}
      onKeyDown={(e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
          e.preventDefault()
          e.currentTarget.requestSubmit()
        }
      }}
      className="rounded-xl border border-border-card bg-background-elevated shadow-[var(--shadow-elevation-mid)]"
    >
      <div className="space-y-4 p-5 sm:p-6">
        <div>
          <FieldLabel htmlFor="url-text" className="mb-2 text-2sm font-semibold">
            URL to inspect
          </FieldLabel>
          <Input
            id="url-text"
            type="url"
            value={urlText}
            onChange={(e) => onUrlTextChange(e.target.value)}
            autoFocus
            placeholder="https://example.com/login"
            className="h-11 w-full rounded-lg border-border bg-surface px-3 font-mono text-sm shadow-none placeholder:text-foreground-subtle hover:border-border-strong focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/10"
          />
          <p className="mt-2 text-2xs text-foreground-subtle">
            Full URL including https://. Shortened links like bit.ly are supported.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel htmlFor="url-source" className="mb-1.5 text-xs font-medium text-foreground-secondary">
              Where you got it
            </FieldLabel>
            <Input
              id="url-source"
              value={urlSource}
              onChange={(e) => onUrlSourceChange(e.target.value)}
              placeholder="e.g. Sent via Facebook DM"
              className="h-9 rounded-lg border-border bg-surface px-3 text-2sm shadow-none placeholder:text-foreground-subtle hover:border-border-strong focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/10"
            />
          </div>
          <div>
            <FieldLabel htmlFor="url-context" className="mb-1.5 text-xs font-medium text-foreground-secondary">
              Why it seems suspicious
            </FieldLabel>
            <Input
              id="url-context"
              value={urlContext}
              onChange={(e) => onUrlContextChange(e.target.value)}
              placeholder="e.g. Asked me to log in urgently"
              className="h-9 rounded-lg border-border bg-surface px-3 text-2sm shadow-none placeholder:text-foreground-subtle hover:border-border-strong focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/10"
            />
          </div>
        </div>

        <div>
          <FieldLabel htmlFor="url-evidence" className="mb-1.5 text-xs font-medium text-foreground-secondary">
            Additional context <span className="text-foreground-subtle">(optional)</span>
          </FieldLabel>
          <Input
            id="url-evidence"
            value={urlEvidence}
            onChange={(e) => onUrlEvidenceChange(e.target.value)}
            placeholder="Anything else that seems off?"
            className="h-9 rounded-lg border-border bg-surface px-3 text-2sm shadow-none placeholder:text-foreground-subtle hover:border-border-strong focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/10"
          />
        </div>

        <div>
          <FieldLabel htmlFor="url-attachment" className="mb-1.5 text-xs font-medium text-foreground-secondary">
            Screenshot <span className="text-foreground-subtle">(optional)</span>
          </FieldLabel>
          <Label
            htmlFor="url-attachment"
            className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-dashed border-border bg-surface px-3 py-2.5 text-2sm text-foreground-muted transition-colors hover:border-border-strong hover:bg-surface-raised"
          >
            <span className="truncate text-2sm text-foreground-muted">
              {attachmentName || "Attach image for more context"}
            </span>
            <span className="shrink-0 text-2xs font-medium uppercase tracking-wider text-foreground-subtle">
              PNG / JPG
            </span>
          </Label>
          <input
            id="url-attachment"
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null
              setAttachmentName(file?.name ?? "")
              onAttachmentChange?.(file)
            }}
          />
        </div>
      </div>

      <div className="flex flex-col items-start justify-between gap-3 border-t border-border px-5 py-3.5 sm:flex-row sm:items-center sm:px-6">
        <span className="text-2xs text-foreground-subtle">
          Link data is checked in real time
        </span>
        <Button
          type="submit"
          disabled={loading || rateLimited || !urlText.trim()}
          className="h-9 w-full rounded-lg px-5 text-2sm sm:w-auto"
        >
          <PaperPlaneTilt size={13} weight="fill" />
          {loading ? "Checking..." : "Analyze URL"}
        </Button>
      </div>
      <RateLimitBadge />
    </form>
  )
}
