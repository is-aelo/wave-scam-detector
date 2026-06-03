import { ArrowRight, WarningCircle } from "@phosphor-icons/react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  formatPercent,
  getRiskLevelTone,
  getRiskScoreTone,
  getRiskTone,
  isParsedScan,
  type ScanMode,
  type ScanResponse,
} from "@/lib/wave-scan-view"

type ScanResultPanelProps = {
  result: ScanResponse | null
  mode: ScanMode
  onNewScan: () => void
  onBackHome: () => void
}

export function ScanResultPanel({
  result,
  mode,
  onNewScan,
  onBackHome,
}: ScanResultPanelProps) {
  const modeLabel = mode === "message" ? "Message scan" : "Link scan"

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">{modeLabel}</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-normal sm:text-3xl">
            Scan result
          </h2>
        </div>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-lg text-foreground-muted hover:bg-surface-secondary hover:text-foreground"
            onClick={onBackHome}
          >
            <ArrowRight size={14} weight="bold" className="rotate-180" />
            Home
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg border-border bg-surface-secondary shadow-none hover:bg-surface-tertiary"
            onClick={onNewScan}
          >
            New scan
          </Button>
        </div>
      </div>

      <Card className="border-border-subtle bg-card shadow-[var(--shadow-card)]">
        <CardContent className="space-y-6 p-5 sm:p-6">
          {!result ? (
            <EmptyState />
          ) : !result.ok ? (
            <ErrorState error={result.error} />
          ) : isParsedScan(result.parsed) ? (
            <>
              <div className="grid gap-5 lg:grid-cols-[150px,1fr] lg:items-start">
                <div className="rounded-lg bg-background-elevated p-4 ring-1 ring-inset ring-border-subtle">
                  <p className="text-xs font-medium text-foreground-muted">
                    Risk score
                  </p>
                  <p
                    className={`mt-3 text-5xl font-semibold tracking-normal ${getRiskScoreTone(
                      result.parsed.risk_level,
                    )}`}
                  >
                    {typeof result.parsed.risk_score === "number"
                      ? Math.round(result.parsed.risk_score)
                      : "?"}
                  </p>
                  <p className="mt-1 text-sm text-foreground-muted">/ 100</p>
                </div>

                <div className="space-y-4">
                  <Badge
                    variant="outline"
                    className={`rounded-md px-2.5 py-1 text-xs font-medium ${getRiskLevelTone(
                      result.parsed.risk_level,
                    )}`}
                  >
                    {result.parsed.risk_level ?? "Unknown"}
                  </Badge>

                  <div className="space-y-2">
                    <h3 className="max-w-3xl text-2xl font-semibold tracking-normal text-balance">
                      {verdictTitle(result.parsed.risk_level)}
                    </h3>
                    <p className="max-w-3xl text-base leading-7 text-foreground-secondary">
                      {result.parsed.summary ?? "No summary returned."}
                    </p>
                  </div>

                  <p className="text-sm leading-6 text-foreground-muted">
                    {getRiskTone(result.parsed.risk_level)}
                  </p>
                </div>
              </div>

              <Separator className="bg-border-subtle" />

              <section className="space-y-3">
                <SectionHeading
                  title="Red flags"
                  detail={
                    result.parsed.red_flags?.length
                      ? `${result.parsed.red_flags.length} signals`
                      : "None returned"
                  }
                />

                {result.parsed.red_flags?.length ? (
                  <div className="divide-y divide-border-subtle rounded-lg border border-border-subtle bg-background-elevated">
                    {result.parsed.red_flags.map((flag, index) => (
                      <div
                        key={flag}
                        className="grid gap-3 px-4 py-3 text-sm leading-6 sm:grid-cols-[2.5rem,1fr]"
                      >
                        <span className="font-mono text-xs text-foreground-subtle">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <p className="text-foreground-secondary">{flag}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm leading-6 text-foreground-muted">
                    No red flags were returned.
                  </p>
                )}
              </section>

              <Separator className="bg-border-subtle" />

              <div className="grid gap-5 lg:grid-cols-[1.1fr,0.9fr]">
                <section className="space-y-3">
                  <SectionHeading title="What could happen" />
                  <p className="text-sm leading-7 text-foreground-secondary">
                    {result.parsed.what_could_happen ??
                      "No scenario was returned."}
                  </p>
                </section>

                <section className="space-y-3 rounded-lg bg-background-elevated p-4 ring-1 ring-inset ring-border-subtle">
                  <SectionHeading title="Details" />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <MetaItem
                      label="Scam type"
                      value={result.parsed.scam_type ?? "Unknown"}
                    />
                    <MetaItem
                      label="Language"
                      value={result.parsed.language_style ?? "Unknown"}
                    />
                    <MetaItem label="Tone" value={result.parsed.tone ?? "Unknown"} />
                    <MetaItem
                      label="Confidence"
                      value={formatPercent(result.parsed.confidence)}
                      valueTone="text-primary"
                    />
                  </div>
                </section>
              </div>

              <Separator className="bg-border-subtle" />

              <section className="space-y-3">
                <SectionHeading title="Recommendation" />
                <div className="rounded-lg bg-primary/10 p-4 ring-1 ring-inset ring-primary/15">
                  <p className="text-sm leading-7 text-foreground-secondary">
                    {result.parsed.recommendation ??
                      "No recommendation was returned."}
                  </p>
                </div>
              </section>

              <div className="flex flex-col gap-3 border-t border-border-subtle pt-4 text-xs text-foreground-muted sm:flex-row sm:items-center">
                <span>{new Date().toLocaleDateString()}</span>
                <span className="hidden text-foreground-subtle sm:inline">/</span>
                <span>{modeLabel}</span>
                <div className="flex min-w-0 flex-1 items-center gap-3 sm:justify-end">
                  <span>Confidence</span>
                  <div className="h-1.5 min-w-24 flex-1 overflow-hidden rounded-full bg-surface-tertiary sm:max-w-48">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-300 ease-out"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.max(
                            0,
                            Math.round((result.parsed.confidence ?? 0) * 100),
                          ),
                        )}%`,
                      }}
                    />
                  </div>
                  <span>{formatPercent(result.parsed.confidence)}</span>
                </div>
              </div>
            </>
          ) : (
            <ErrorState error="The backend replied, but the content was not in the expected format." />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="rounded-lg bg-background-elevated p-6 ring-1 ring-inset ring-border-subtle">
      <p className="text-sm leading-6 text-foreground-muted">
        No scan result yet.
      </p>
    </div>
  )
}

function ErrorState({ error }: { error: string }) {
  return (
    <div className="rounded-lg bg-danger/10 p-6 ring-1 ring-inset ring-danger/15">
      <p className="flex items-center gap-2 text-sm font-medium text-danger">
        <WarningCircle size={16} weight="duotone" />
        Backend error
      </p>
      <p className="mt-2 text-sm leading-6 text-foreground-secondary">
        {error}
      </p>
    </div>
  )
}

function SectionHeading({
  title,
  detail,
}: {
  title: string
  detail?: string
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h3 className="text-sm font-medium tracking-normal text-foreground">
        {title}
      </h3>
      {detail ? <p className="text-xs text-foreground-muted">{detail}</p> : null}
    </div>
  )
}

function MetaItem({
  label,
  value,
  valueTone,
}: {
  label: string
  value: string
  valueTone?: string
}) {
  return (
    <div>
      <p className="text-xs text-foreground-muted">{label}</p>
      <p className={`mt-1 text-sm font-medium ${valueTone ?? "text-foreground"}`}>
        {value}
      </p>
    </div>
  )
}

function verdictTitle(riskLevel?: string) {
  switch (riskLevel) {
    case "Safe":
      return "Looks safe based on the signals Wave could verify"
    case "Low Risk":
      return "Mostly okay, but keep an eye on the details"
    case "Caution":
      return "Worth checking carefully before you proceed"
    case "Suspicious":
      return "Likely risky. Verify before you proceed"
    case "High Risk":
      return "High risk. Avoid this and verify independently"
    default:
      return "Wave has a read on this scan"
  }
}
