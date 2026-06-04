import { ArrowRight, ShieldCheck } from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import { CircularRiskIndicator } from "@/components/ui/circular-risk-indicator"
import { RiskSpectrumBar } from "@/components/ui/risk-spectrum-bar"
import { EnhancedRedFlags } from "@/components/ui/enhanced-red-flags"
import {
  formatPercent,
  getRiskLevelTone,
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

function getRiskAccentColor(riskLevel?: string): string {
  switch (riskLevel) {
    case "Safe":
      return "var(--risk-safe)"
    case "Low Risk":
      return "var(--risk-low)"
    case "Caution":
      return "var(--risk-caution)"
    case "Suspicious":
      return "var(--risk-suspicious)"
    case "High Risk":
      return "var(--risk-high)"
    default:
      return "var(--primary)"
  }
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
      return "Likely risky — verify before you proceed"
    case "High Risk":
      return "High risk. Avoid this and verify independently"
    default:
      return "Wave has a read on this scan"
  }
}

export function ScanResultPanel({
  result,
  mode,
  onNewScan,
  onBackHome,
}: ScanResultPanelProps) {
  const modeLabel = mode === "message" ? "Message scan" : "Link scan"

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="mb-0.5 text-[11px] font-medium uppercase tracking-wider text-foreground-subtle">
            {modeLabel}
          </p>
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-[22px]">
            Scan result
          </h2>
        </div>

        <div className="flex gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            className="text-[13px] text-foreground-muted"
            onClick={onBackHome}
          >
            <ArrowRight size={12} weight="bold" className="rotate-180" />
            Home
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-border text-[13px] text-foreground-secondary"
            style={{ background: "transparent" }}
            onClick={onNewScan}
          >
            New scan
          </Button>
        </div>
      </div>

      {!result ? (
        <EmptyState />
      ) : !result.ok ? (
        <ErrorState error={result.error} />
      ) : isParsedScan(result.parsed) ? (
        <div className="flex flex-col gap-4">
          {/* Card 1: Risk verdict */}
          <div className="rounded-xl border border-border-card bg-background-elevated shadow-[var(--shadow-elevation-high)]">
            <div className="flex flex-col sm:flex-row">
              <div className="flex flex-col items-center justify-center gap-2 border-b border-border px-4 py-6 sm:border-b-0 sm:border-r sm:px-8 sm:py-7">
                <CircularRiskIndicator
                  score={typeof result.parsed.risk_score === "number" ? result.parsed.risk_score : 0}
                  riskLevel={result.parsed.risk_level ?? "Unknown"}
                  size={72}
                  animated
                />
                <span
                  className="text-[10px] font-semibold uppercase tracking-wider"
                  style={{ color: getRiskAccentColor(result.parsed.risk_level) }}
                >
                  {result.parsed.risk_level ?? "Unknown"}
                </span>
              </div>

              <div className="flex flex-1 flex-col justify-center gap-2 px-5 py-5 sm:px-7 sm:py-6">
                <p className="text-[15px] font-semibold leading-snug tracking-tight text-foreground">
                  {verdictTitle(result.parsed.risk_level)}
                </p>
                <p className="text-[13px] leading-relaxed text-foreground-muted">
                  {result.parsed.summary ?? "No summary returned."}
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Risk spectrum */}
          <div className="rounded-xl border border-border-card bg-background-elevated px-4 py-3.5 shadow-[var(--shadow-elevation-low)] sm:px-6 sm:py-4">
            <RiskSpectrumBar
              score={typeof result.parsed.risk_score === "number" ? result.parsed.risk_score : 0}
              riskLevel={result.parsed.risk_level ?? "Unknown"}
            />
          </div>

          {/* Card 3: Red flags */}
          <div className="rounded-xl border border-border-card bg-background-elevated px-4 py-4 shadow-[var(--shadow-elevation-mid)] sm:px-6 sm:py-5">
            <div className="mb-3 flex items-center justify-between sm:mb-3.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-foreground-subtle">
                Red flags
              </span>
              {result.parsed.red_flags?.length ? (
                <span className="text-[11px] text-foreground-subtle">
                  {result.parsed.red_flags.length} signals
                </span>
              ) : null}
            </div>
            <EnhancedRedFlags
              flags={result.parsed.red_flags ?? []}
              riskLevel={result.parsed.risk_level ?? "Unknown"}
            />
          </div>

          {/* Card 4: Details grid */}
          <div className="rounded-xl border border-border-card bg-background-elevated shadow-[var(--shadow-elevation-low)]">
            <div className="grid grid-cols-2 sm:grid-cols-4">
              {[
                { label: "Scam type", value: result.parsed.scam_type ?? "Unknown" },
                { label: "Language", value: result.parsed.language_style ?? "Unknown" },
                { label: "Tone", value: result.parsed.tone ?? "Unknown" },
                {
                  label: "Confidence",
                  value: formatPercent(result.parsed.confidence),
                  accent: getRiskAccentColor(result.parsed.risk_level),
                },
              ].map((item, i, arr) => (
                <div
                  key={item.label}
                  className="border-border px-4 py-3 sm:px-5 sm:py-3.5"
                  style={{
                    borderRight: i % 2 === 0 && i < arr.length - 1 ? "1px solid var(--border)" : "none",
                    borderBottom: i < arr.length - 2 ? "1px solid var(--border)" : "none",
                  }}
                >
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-foreground-subtle">
                    {item.label}
                  </p>
                  <p
                    className="text-[13px] font-medium"
                    style={{ color: item.accent ?? "var(--foreground)" }}
                  >
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Card 5 & 6: Impact + Guidance side by side */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-l-2 border-l-accent-brand border-border-card bg-background-elevated px-4 py-4 shadow-[var(--shadow-elevation-mid)] sm:px-5 sm:py-5">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-foreground-subtle sm:mb-2.5">
                What could happen
              </p>
              <p className="text-[13px] leading-relaxed text-foreground-secondary">
                {result.parsed.what_could_happen ?? "No scenario was returned."}
              </p>
            </div>

            <div className="rounded-xl border border-l-2 border-l-accent-brand border-border-card bg-background-elevated px-4 py-4 shadow-[var(--shadow-elevation-mid)] sm:px-5 sm:py-5">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-foreground-subtle sm:mb-2.5">
                Recommendation
              </p>
              <p className="text-[13px] leading-relaxed text-foreground-secondary">
                {result.parsed.recommendation ?? "No recommendation was returned."}
              </p>
            </div>
          </div>

          {/* Card 7: Footer */}
          <div className="rounded-xl border border-border-card bg-background-elevated px-4 py-3 shadow-[var(--shadow-elevation-low)] sm:px-6">
            <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center sm:gap-4">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-foreground-subtle">
                  {new Date().toLocaleDateString()}
                </span>
                <span className="text-[11px] text-border-strong">/</span>
                <span className="text-[11px] text-foreground-subtle">{modeLabel}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-foreground-subtle">
                  Analysis confidence
                </span>
                <div className="h-0.5 w-16 overflow-hidden rounded-full bg-border-subtle sm:w-20">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${Math.min(100, Math.max(0, Math.round((result.parsed.confidence ?? 0) * 100)))}%`,
                      background: getRiskAccentColor(result.parsed.risk_level),
                    }}
                  />
                </div>
                <span
                  className="text-[11px] font-medium"
                  style={{ color: getRiskAccentColor(result.parsed.risk_level) }}
                >
                  {formatPercent(result.parsed.confidence)}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <ErrorState error="The backend replied, but the content was not in the expected format." />
      )}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-border-card bg-background-elevated px-6 py-12 shadow-[var(--shadow-elevation-low)]">
      <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface">
        <ShieldCheck size={20} className="text-foreground-muted" />
      </span>
      <p className="text-[13px] font-medium text-foreground-muted">No scan result yet</p>
    </div>
  )
}

function ErrorState({ error }: { error: string }) {
  return (
    <div className="rounded-xl border border-risk-high-border bg-risk-high-dim p-6 shadow-[var(--shadow-elevation-low)]">
      <p className="mb-1.5 text-xs font-medium tracking-wide text-risk-high">
        Error
      </p>
      <p className="text-[13px] leading-relaxed text-foreground-secondary">
        {error}
      </p>
    </div>
  )
}
