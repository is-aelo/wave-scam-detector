"use client"

import { useState, type FormEvent } from "react"
import { ImageSquare, LockKey, PaperPlaneTilt } from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type MessageScanFormProps = {
  messageText: string
  messageSource: string
  messageContext: string
  messageEvidence: string
  loading: boolean
  onMessageTextChange: (value: string) => void
  onMessageSourceChange: (value: string) => void
  onMessageContextChange: (value: string) => void
  onMessageEvidenceChange: (value: string) => void
  onExampleSelect: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

const examples = [
  {
    label: "Job offer scam",
    value:
      "Hi po! Naghahanap po kami ng applicants for our company. P35,000/month ang sweldo, work from home setup. Kailangan lang po mag-bayad ng P1,500 para sa training kit at ID processing.",
  },
  {
    label: "Freelance scam",
    value:
      "Hello! I found your profile and I need a logo designer for a startup. Budget is $500. I will send you a check for $2,000 - just keep $500 for yourself and wire the rest to my printing vendor.",
  },
  {
    label: "Marketplace scam",
    value:
      "Selling brand new iPhone 15 Pro Max 256GB for only P18,000! Legit seller. GCash accepted. Item is with my cousin in Cebu, I can ship via LBC. Pay first before I send tracking number.",
  },
]

export function MessageScanForm({
  messageText,
  messageSource,
  messageContext,
  messageEvidence,
  loading,
  onMessageTextChange,
  onMessageSourceChange,
  onMessageContextChange,
  onMessageEvidenceChange,
  onExampleSelect,
  onSubmit,
}: MessageScanFormProps) {
  const [attachmentName, setAttachmentName] = useState("")

  return (
    <form onSubmit={onSubmit}>
      <div className="mb-4 space-y-2">
        <FieldLabel htmlFor="message-text">Paste the message</FieldLabel>
        <Textarea
          id="message-text"
          value={messageText}
          onChange={(event) => onMessageTextChange(event.target.value)}
          rows={6}
          className="min-h-40 resize-y rounded-lg border-border-subtle bg-surface px-3 py-3 text-[13px] leading-6 shadow-none placeholder:text-foreground-subtle hover:border-border-strong hover:bg-surface-raised focus-visible:border-primary focus-visible:bg-surface-raised focus-visible:ring-2 focus-visible:ring-primary/10"
          placeholder="Paste the suspicious message here - job offer, DM, email, marketplace listing, etc."
        />
        <p className="text-[11px] text-foreground-subtle">
          Longer messages give Wave more signals to analyze.
        </p>
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <FieldInput
          id="message-source"
          label="Sender / Source"
          value={messageSource}
          onChange={onMessageSourceChange}
          placeholder="e.g. Facebook, Telegram, email"
        />
        <FieldInput
          id="message-context"
          label="Scan mode"
          value={messageContext}
          onChange={onMessageContextChange}
          placeholder="e.g. Job seeker, Freelancer"
        />
      </div>

      <div className="mb-4">
        <FieldInput
          id="message-evidence"
          label="Additional context"
          value={messageEvidence}
          onChange={onMessageEvidenceChange}
          placeholder="e.g. They asked me to pay P1,500 upfront"
        />
      </div>

      <AttachmentInput
        id="message-attachment"
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
          Your input is never stored
        </p>

        <Button
          type="submit"
          disabled={loading}
          className="h-10 rounded-lg px-6 text-[13px]"
        >
          <PaperPlaneTilt size={15} weight="fill" />
          {loading ? "Scanning" : "Analyze message"}
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
