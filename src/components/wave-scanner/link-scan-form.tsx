"use client"

import { useState, type FormEvent } from "react"
import { ImageSquare, LockKey, PaperPlaneTilt } from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type LinkScanFormProps = {
  urlText: string
  urlSource: string
  urlContext: string
  urlEvidence: string
  loading: boolean
  onUrlTextChange: (value: string) => void
  onUrlSourceChange: (value: string) => void
  onUrlContextChange: (value: string) => void
  onUrlEvidenceChange: (value: string) => void
  onExampleSelect: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

const examples = [
  {
    label: "Phishing link",
    value: "https://paypa1-secure-login.verify-account.com/signin",
  },
  {
    label: "Legitimate site",
    value: "https://careers.shopee.ph/job/senior-product-designer",
  },
  {
    label: "Shortened URL",
    value: "https://bit.ly/3xK9mPa",
  },
]

export function LinkScanForm({
  urlText,
  urlSource,
  urlContext,
  urlEvidence,
  loading,
  onUrlTextChange,
  onUrlSourceChange,
  onUrlContextChange,
  onUrlEvidenceChange,
  onExampleSelect,
  onSubmit,
}: LinkScanFormProps) {
  const [attachmentName, setAttachmentName] = useState("")

  return (
    <form onSubmit={onSubmit}>
      <div className="mb-4 space-y-2">
        <FieldLabel htmlFor="url-text">Enter URL to check</FieldLabel>
        <Input
          id="url-text"
          type="url"
          value={urlText}
          onChange={(event) => onUrlTextChange(event.target.value)}
          placeholder="https://example.com/job-application"
          className="h-10 rounded-lg border-border-subtle bg-surface px-3 font-mono text-xs shadow-none placeholder:text-foreground-subtle hover:border-border-strong hover:bg-surface-raised focus-visible:border-primary focus-visible:bg-surface-raised focus-visible:ring-2 focus-visible:ring-primary/10"
        />
        <p className="text-[11px] text-foreground-subtle">
          Full URL including https://. Shortened links like bit.ly are also
          supported.
        </p>
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <FieldInput
          id="url-source"
          label="Context"
          value={urlSource}
          onChange={onUrlSourceChange}
          placeholder="e.g. Received via Facebook DM"
        />
        <FieldInput
          id="url-context"
          label="Why it seems suspicious"
          value={urlContext}
          onChange={onUrlContextChange}
          placeholder="e.g. Asked to log in urgently"
        />
      </div>

      <div className="mb-4">
        <FieldInput
          id="url-evidence"
          label="Additional context"
          value={urlEvidence}
          onChange={onUrlEvidenceChange}
          placeholder="e.g. Suspicious domain, redirect, or payment request"
        />
      </div>

      <AttachmentInput
        id="url-attachment"
        attachmentName={attachmentName}
        onAttachmentChange={setAttachmentName}
      />

      <DividerLabel>try an example</DividerLabel>

      <div className="flex flex-wrap gap-2">
        {examples.map((example) => (
          <Button
            key={example.label}
            type="button"
            variant="outline"
            size="sm"
            className="h-7 rounded-full border-border-subtle bg-surface px-3 text-[11px] text-foreground-subtle shadow-none hover:border-border-strong hover:bg-surface-raised hover:text-foreground"
            onClick={() => onExampleSelect(example.value)}
          >
            {example.label}
          </Button>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-1.5 text-[11px] text-foreground-subtle">
          <LockKey size={13} />
          Wave checks the link and surrounding context
        </p>

        <Button
          type="submit"
          disabled={loading}
          className="h-10 rounded-lg px-6 text-[13px]"
        >
          <PaperPlaneTilt size={15} weight="fill" />
          {loading ? "Checking" : "Analyze URL"}
        </Button>
      </div>
    </form>
  )
}

function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor: string
  children: string
}) {
  return (
    <Label
      htmlFor={htmlFor}
      className="block font-mono text-[11px] uppercase tracking-wider text-foreground-subtle"
    >
      {children}
    </Label>
  )
}

function FieldInput({
  id,
  label,
  value,
  onChange,
  placeholder,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  placeholder: string
}) {
  return (
    <div className="space-y-2">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-10 rounded-lg border-border-subtle bg-surface px-3 text-[13px] shadow-none placeholder:text-foreground-subtle hover:border-border-strong hover:bg-surface-raised focus-visible:border-primary focus-visible:bg-surface-raised focus-visible:ring-2 focus-visible:ring-primary/10"
      />
    </div>
  )
}

function AttachmentInput({
  id,
  attachmentName,
  onAttachmentChange,
}: {
  id: string
  attachmentName: string
  onAttachmentChange: (value: string) => void
}) {
  return (
    <div className="mb-4 space-y-2">
      <FieldLabel htmlFor={id}>Image attachment</FieldLabel>
      <Label
        htmlFor={id}
        className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-dashed border-border-subtle bg-surface px-3 py-3 text-[13px] text-foreground-muted transition-colors hover:border-border-strong hover:bg-surface-raised"
      >
        <span className="flex min-w-0 items-center gap-2">
          <ImageSquare size={16} className="shrink-0 text-primary" />
          <span className="truncate">
            {attachmentName || "Attach screenshot or image evidence"}
          </span>
        </span>
        <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-foreground-subtle">
          PNG / JPG
        </span>
      </Label>
      <input
        id={id}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(event) =>
          onAttachmentChange(event.target.files?.[0]?.name ?? "")
        }
      />
    </div>
  )
}

function DividerLabel({ children }: { children: string }) {
  return (
    <div className="my-5 flex items-center gap-3 font-mono text-[11px] text-foreground-subtle">
      <span className="h-px flex-1 bg-border-subtle" />
      <span>{children}</span>
      <span className="h-px flex-1 bg-border-subtle" />
    </div>
  )
}
