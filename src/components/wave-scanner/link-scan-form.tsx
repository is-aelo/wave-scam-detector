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
  const [expanded, setExpanded] = useState(false)
  const [attachmentName, setAttachmentName] = useState("")

  return (
    <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      <div style={{ marginBottom: 16 }}>
        <FieldLabel htmlFor="url-text">URL</FieldLabel>
        <Input
          id="url-text"
          type="url"
          value={urlText}
          onChange={(e) => onUrlTextChange(e.target.value)}
          placeholder="https://example.com/login"
          className="h-9 rounded-lg border-border-subtle bg-surface px-3 font-mono text-xs shadow-none placeholder:text-foreground-subtle hover:border-border-strong hover:bg-surface-raised focus-visible:border-primary focus-visible:bg-surface-raised focus-visible:ring-2 focus-visible:ring-primary/10"
        />
        <p
          style={{
            fontSize: 11,
            color: "var(--foreground-subtle)",
            marginTop: 5,
          }}
        >
          Full URL including https://. Shortened links like bit.ly are supported.
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
              <FieldLabel htmlFor="url-source">Where you got it</FieldLabel>
              <Input
                id="url-source"
                value={urlSource}
                onChange={(e) => onUrlSourceChange(e.target.value)}
                placeholder="e.g. Sent via Facebook DM"
                className="h-9 rounded-lg border-border-subtle bg-surface px-3 text-[13px] shadow-none placeholder:text-foreground-subtle hover:border-border-strong focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/10"
              />
            </div>
            <div>
              <FieldLabel htmlFor="url-context">Why it seems suspicious</FieldLabel>
              <Input
                id="url-context"
                value={urlContext}
                onChange={(e) => onUrlContextChange(e.target.value)}
                placeholder="e.g. Asked me to log in urgently"
                className="h-9 rounded-lg border-border-subtle bg-surface px-3 text-[13px] shadow-none placeholder:text-foreground-subtle hover:border-border-strong focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/10"
              />
            </div>
          </div>

          <div>
            <FieldLabel htmlFor="url-evidence">Additional context</FieldLabel>
            <Input
              id="url-evidence"
              value={urlEvidence}
              onChange={(e) => onUrlEvidenceChange(e.target.value)}
              placeholder="Anything else that seems off?"
              className="h-9 rounded-lg border-border-subtle bg-surface px-3 text-[13px] shadow-none placeholder:text-foreground-subtle hover:border-border-strong focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/10"
            />
          </div>

          <div>
            <FieldLabel htmlFor="url-attachment">Screenshot</FieldLabel>
            <Label
              htmlFor="url-attachment"
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
              id="url-attachment"
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
          Wave checks the link and surrounding context
        </span>
        <Button
          type="submit"
          disabled={loading}
          className="h-9 rounded-lg px-5 text-[13px]"
        >
          <PaperPlaneTilt size={13} weight="fill" />
          {loading ? "Checking..." : "Analyze URL"}
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