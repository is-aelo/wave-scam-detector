"use client"

import { useState, type FormEvent } from "react"
import {
  PaperPlaneTilt,
  LockKey,
  Image,
} from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FieldLabel } from "@/components/ui/field-label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type MessageScanFormProps = {
  messageText: string
  messageSource: string
  messageEvidence: string
  loading: boolean
  onMessageTextChange: (value: string) => void
  onMessageSourceChange: (value: string) => void
  onMessageEvidenceChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

const sourceOptions = [
  "Facebook",
  "Telegram",
  "Email",
  "WhatsApp",
  "Instagram",
  "LinkedIn",
  "SMS",
  "Other",
]

export function MessageScanForm({
  messageText,
  messageSource,
  messageEvidence,
  loading,
  onMessageTextChange,
  onMessageSourceChange,
  onMessageEvidenceChange,
  onSubmit,
}: MessageScanFormProps) {
  const [attachmentName, setAttachmentName] = useState("")

  return (
    <form onSubmit={onSubmit} className="rounded-xl border border-border-card bg-background-elevated shadow-[var(--shadow-elevation-mid)]">
      <div className="space-y-4 p-5 sm:p-6">
        <div>
          <FieldLabel htmlFor="message-text" className="mb-2 text-[13px] font-semibold">
            Message to analyze
          </FieldLabel>
          <Textarea
            id="message-text"
            value={messageText}
            onChange={(e) => onMessageTextChange(e.target.value)}
            rows={6}
            className="min-h-[140px] resize-y rounded-lg border-border bg-surface px-3 py-3 text-[14px] leading-7 shadow-none placeholder:text-foreground-subtle hover:border-border-strong focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/10 sm:min-h-[160px]"
            placeholder="Paste the full message you received..."
          />
          <p className="mt-2 text-[11px] text-foreground-subtle">
            Longer messages give Wave more signals to work with.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel htmlFor="message-source" className="mb-1.5 text-[12px] font-medium text-foreground-secondary">
              Platform
            </FieldLabel>
            <Select
              value={sourceOptions.includes(messageSource) ? messageSource : "Other"}
              onValueChange={(val) => {
                if (val === "Other") {
                  onMessageSourceChange(sourceOptions.includes(messageSource) ? "" : messageSource)
                } else {
                  onMessageSourceChange(val)
                }
              }}
            >
              <SelectTrigger className="h-9 w-full rounded-lg border-border bg-surface text-[13px] shadow-none">
                <SelectValue placeholder="Where did you receive this?" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {sourceOptions.map((opt) => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {!sourceOptions.includes(messageSource) && (
              <Input
                id="message-source-custom"
                value={messageSource}
                onChange={(e) => onMessageSourceChange(e.target.value)}
                placeholder="Specify platform"
                className="mt-2 h-9 rounded-lg border-border bg-surface px-3 text-[13px] shadow-none placeholder:text-foreground-subtle"
              />
            )}
          </div>
          <div>
            <FieldLabel htmlFor="message-evidence" className="mb-1.5 text-[12px] font-medium text-foreground-secondary">
              Additional context
            </FieldLabel>
            <Input
              id="message-evidence"
              value={messageEvidence}
              onChange={(e) => onMessageEvidenceChange(e.target.value)}
              placeholder="Anything else that seems off?"
              className="h-9 rounded-lg border-border bg-surface px-3 text-[13px] shadow-none placeholder:text-foreground-subtle hover:border-border-strong focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/10"
            />
          </div>
        </div>

        <div>
          <FieldLabel htmlFor="message-attachment" className="mb-1.5 text-[12px] font-medium text-foreground-secondary">
            Screenshot <span className="text-foreground-subtle">(optional)</span>
          </FieldLabel>
          <Label
            htmlFor="message-attachment"
            className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-dashed border-border bg-surface px-3 py-2.5 text-[13px] text-foreground-muted transition-colors hover:border-border-strong hover:bg-surface-raised"
          >
            <span className="flex min-w-0 items-center gap-2">
              <Image size={15} className="shrink-0 text-foreground-muted" />
              <span className="truncate text-[13px] text-foreground-muted">
                {attachmentName || "Attach image evidence"}
              </span>
            </span>
            <span className="shrink-0 text-[10px] font-medium uppercase tracking-wider text-foreground-subtle">
              PNG / JPG
            </span>
          </Label>
          <input
            id="message-attachment"
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => setAttachmentName(e.target.files?.[0]?.name ?? "")}
          />
        </div>
      </div>

      <div className="flex flex-col items-start justify-between gap-3 border-t border-border px-5 py-3.5 sm:flex-row sm:items-center sm:px-6">
        <span className="flex items-center gap-1.5 text-[11px] text-foreground-subtle">
          <LockKey size={12} />
          Your input is never stored
        </span>
        <Button
          type="submit"
          disabled={loading || !messageText.trim()}
          className="h-9 w-full rounded-lg px-5 text-[13px] sm:w-auto"
        >
          <PaperPlaneTilt size={13} weight="fill" />
          {loading ? "Scanning..." : "Analyze message"}
        </Button>
      </div>
    </form>
  )
}
