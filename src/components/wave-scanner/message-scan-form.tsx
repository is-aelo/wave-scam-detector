"use client"

import { useState, type FormEvent } from "react"
import {
  PaperPlaneTilt,
  LockKey,
  CaretDown,
  Image,
} from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
  onExampleSelect: (value: string) => void
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
      "Selling brand new iPhone 15 Pro Max 256GB for only P18,000! GCash accepted. Item is with my cousin in Cebu, I can ship via LBC. Pay first before I send tracking number.",
  },
]

export function MessageScanForm({
  messageText,
  messageSource,
  messageEvidence,
  loading,
  onMessageTextChange,
  onMessageSourceChange,
  onMessageEvidenceChange,
  onExampleSelect,
  onSubmit,
}: MessageScanFormProps) {
  const [expanded, setExpanded] = useState(false)
  const [attachmentName, setAttachmentName] = useState("")

  return (
    <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      <div style={{ marginBottom: 16 }}>
        <FieldLabel htmlFor="message-text">Message</FieldLabel>
        <Textarea
          id="message-text"
          value={messageText}
          onChange={(e) => onMessageTextChange(e.target.value)}
          rows={6}
          className="min-h-40 resize-y rounded-lg border-border-subtle bg-surface px-3 py-3 text-[13px] leading-6 shadow-none placeholder:text-foreground-subtle hover:border-border-strong hover:bg-surface-raised focus-visible:border-primary focus-visible:bg-surface-raised focus-visible:ring-2 focus-visible:ring-primary/10"
          placeholder="Paste the message you received, or describe the situation..."
        />
        <p
          style={{
            fontSize: 11,
            color: "var(--foreground-subtle)",
            marginTop: 5,
          }}
        >
          Longer messages give Wave more signals to analyze.
        </p>
      </div>

      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          padding: "10px 0",
          background: "transparent",
          border: "none",
          borderTop: "0.5px solid var(--border-subtle)",
          borderBottom: expanded ? "none" : "0.5px solid var(--border-subtle)",
          cursor: "pointer",
          marginBottom: expanded ? 0 : 16,
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: "0.07em",
            textTransform: "uppercase",
            color: "var(--foreground-subtle)",
          }}
        >
          Optional details
        </span>
        <CaretDown
          size={13}
          weight="bold"
          style={{
            color: "var(--foreground-subtle)",
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        />
      </button>

      {expanded && (
        <div
          style={{
            borderBottom: "0.5px solid var(--border-subtle)",
            paddingBottom: 16,
            marginBottom: 16,
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <FieldLabel htmlFor="message-source">Platform</FieldLabel>
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
                <SelectTrigger className="w-full h-9 rounded-lg border-border-subtle bg-surface text-[13px] shadow-none">
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
                  className="mt-2 h-9 rounded-lg border-border-subtle bg-surface px-3 text-[13px] shadow-none placeholder:text-foreground-subtle"
                />
              )}
            </div>
            <div>
              <FieldLabel htmlFor="message-evidence">Additional context</FieldLabel>
              <Input
                id="message-evidence"
                value={messageEvidence}
                onChange={(e) => onMessageEvidenceChange(e.target.value)}
                placeholder="Anything else that seems off?"
                className="h-9 rounded-lg border-border-subtle bg-surface px-3 text-[13px] shadow-none placeholder:text-foreground-subtle hover:border-border-strong focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/10"
              />
            </div>
          </div>

          <div>
            <FieldLabel htmlFor="message-attachment">Screenshot</FieldLabel>
            <Label
              htmlFor="message-attachment"
              className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-dashed border-border-subtle bg-surface px-3 py-2.5 text-[13px] text-foreground-muted transition-colors hover:border-border-strong hover:bg-surface-raised"
            >
              <span style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                <Image size={14} style={{ flexShrink: 0, color: "var(--foreground-muted)" }} />
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 13, color: "var(--foreground-muted)" }}>
                  {attachmentName || "Attach image evidence"}
                </span>
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 500,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "var(--foreground-subtle)",
                  flexShrink: 0,
                }}
              >
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
      )}

      <div style={{ marginBottom: 6 }}>
        <DividerLabel>try an example</DividerLabel>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {examples.map((ex) => (
            <Button
              key={ex.label}
              type="button"
              variant="outline"
              size="sm"
              className="h-7 rounded-full border-border-subtle bg-surface px-3 text-[11px] text-foreground-subtle shadow-none hover:border-border-strong hover:bg-surface-raised hover:text-foreground"
              onClick={() => onExampleSelect(ex.value)}
            >
              {ex.label}
            </Button>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: 16,
          marginTop: 8,
          borderTop: "0.5px solid var(--border-subtle)",
        }}
      >
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 11,
            color: "var(--foreground-subtle)",
          }}
        >
          <LockKey size={12} />
          Your input is never stored
        </span>
        <Button
          type="submit"
          disabled={loading}
          className="h-9 rounded-lg px-5 text-[13px]"
        >
          <PaperPlaneTilt size={13} weight="fill" />
          {loading ? "Scanning..." : "Analyze message"}
        </Button>
      </div>
    </form>
  )
}

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: string }) {
  return (
    <label
      htmlFor={htmlFor}
      style={{
        display: "block",
        fontSize: 10,
        fontWeight: 500,
        letterSpacing: "0.07em",
        textTransform: "uppercase",
        color: "var(--foreground-subtle)",
        marginBottom: 6,
      }}
    >
      {children}
    </label>
  )
}

function DividerLabel({ children }: { children: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        fontSize: 10,
        letterSpacing: "0.07em",
        textTransform: "uppercase",
        color: "var(--foreground-subtle)",
        marginBottom: 10,
      }}
    >
      <span style={{ flex: 1, height: "0.5px", background: "var(--border-subtle)" }} />
      {children}
      <span style={{ flex: 1, height: "0.5px", background: "var(--border-subtle)" }} />
    </div>
  )
}