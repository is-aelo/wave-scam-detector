import { ArrowRight } from "@phosphor-icons/react"

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
    <div
      style={{
        maxWidth: 680,
        margin: "0 auto",
        padding: "32px 16px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <div>
          <p
            style={{
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.07em",
              textTransform: "uppercase",
              color: "var(--foreground-subtle)",
              marginBottom: 4,
            }}
          >
            {modeLabel}
          </p>
          <h2
            style={{
              fontSize: 22,
              fontWeight: 500,
              letterSpacing: "-0.02em",
              color: "var(--foreground)",
            }}
          >
            Scan result
          </h2>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <Button
            variant="ghost"
            size="sm"
            style={{ color: "var(--foreground-muted)", fontSize: 13 }}
            onClick={onBackHome}
          >
            <ArrowRight size={12} weight="bold" style={{ transform: "rotate(180deg)" }} />
            Home
          </Button>
          <Button
            variant="outline"
            size="sm"
            style={{
              fontSize: 13,
              borderColor: "var(--border)",
              background: "transparent",
              color: "var(--foreground-secondary)",
            }}
            onClick={onNewScan}
          >
            New scan
          </Button>
        </div>
      </div>

      <div
        style={{
          background: "var(--primary-dim)",
          border: "0.5px solid var(--border-subtle)",
          borderRadius: 14,
          overflow: "hidden",
        }}
      >
        {!result ? (
          <EmptyState />
        ) : !result.ok ? (
          <ErrorState error={result.error} />
        ) : isParsedScan(result.parsed) ? (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                borderBottom: "0.5px solid var(--border-subtle)",
              }}
            >
              <div
                style={{
                  padding: "28px 24px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  borderRight: "0.5px solid var(--border-subtle)",
                }}
              >
                <CircularRiskIndicator
                  score={typeof result.parsed.risk_score === "number" ? result.parsed.risk_score : 0}
                  riskLevel={result.parsed.risk_level ?? "Unknown"}
                  size={72}
                  animated
                />
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 500,
                    letterSpacing: "0.07em",
                    textTransform: "uppercase",
                    color: getRiskAccentColor(result.parsed.risk_level),
                  }}
                >
                  {result.parsed.risk_level ?? "Unknown"}
                </span>
              </div>

              <div
                style={{
                  padding: "24px 28px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <p
                  style={{
                    fontSize: 15,
                    fontWeight: 500,
                    letterSpacing: "-0.01em",
                    color: "var(--foreground)",
                    lineHeight: 1.4,
                  }}
                >
                  {verdictTitle(result.parsed.risk_level)}
                </p>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--foreground-muted)",
                    lineHeight: 1.65,
                  }}
                >
                  {result.parsed.summary ?? "No summary returned."}
                </p>
              </div>
            </div>

            <div
              style={{
                padding: "16px 24px",
                borderBottom: "0.5px solid var(--border-subtle)",
              }}
            >
              <RiskSpectrumBar
                score={typeof result.parsed.risk_score === "number" ? result.parsed.risk_score : 0}
                riskLevel={result.parsed.risk_level ?? "Unknown"}
              />
            </div>

            <div
              style={{
                padding: "20px 24px",
                borderBottom: "0.5px solid var(--border-subtle)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 14,
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
                  Red flags
                </span>
                {result.parsed.red_flags?.length ? (
                  <span
                    style={{
                      fontSize: 11,
                      color: "var(--foreground-subtle)",
                    }}
                  >
                    {result.parsed.red_flags.length} signals
                  </span>
                ) : null}
              </div>
              <EnhancedRedFlags
                flags={result.parsed.red_flags ?? []}
                riskLevel={result.parsed.risk_level ?? "Unknown"}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                borderBottom: "0.5px solid var(--border-subtle)",
              }}
            >
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
                  style={{
                    padding: "14px 20px",
                    borderRight: i < arr.length - 1 ? "0.5px solid var(--border-subtle)" : "none",
                  }}
                >
                  <p
                    style={{
                      fontSize: 10,
                      fontWeight: 500,
                      letterSpacing: "0.07em",
                      textTransform: "uppercase",
                      color: "var(--foreground-subtle)",
                      marginBottom: 5,
                    }}
                  >
                    {item.label}
                  </p>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: item.accent ?? "var(--foreground)",
                    }}
                  >
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ padding: "20px 24px", borderBottom: "0.5px solid var(--border-subtle)" }}>
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  color: "var(--foreground-subtle)",
                  marginBottom: 10,
                }}
              >
                What could happen
              </p>
              <p style={{ fontSize: 13, color: "var(--foreground-secondary)", lineHeight: 1.65 }}>
                {result.parsed.what_could_happen ?? "No scenario was returned."}
              </p>
            </div>

            <div style={{ padding: "20px 24px", borderBottom: "0.5px solid var(--border-subtle)" }}>
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  color: "var(--foreground-subtle)",
                  marginBottom: 10,
                }}
              >
                Recommendation
              </p>
              <p style={{ fontSize: 13, color: "var(--foreground-secondary)", lineHeight: 1.65 }}>
                {result.parsed.recommendation ?? "No recommendation was returned."}
              </p>
            </div>

            <div
              style={{
                padding: "12px 24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 11, color: "var(--foreground-subtle)" }}>
                  {new Date().toLocaleDateString()}
                </span>
                <span style={{ fontSize: 11, color: "var(--border-strong)" }}>/</span>
                <span style={{ fontSize: 11, color: "var(--foreground-subtle)" }}>{modeLabel}</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 11, color: "var(--foreground-subtle)" }}>
                  Analysis confidence
                </span>
                <div
                  style={{
                    width: 80,
                    height: 2,
                    borderRadius: 99,
                    background: "var(--border-subtle)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      borderRadius: 99,
                      background: getRiskAccentColor(result.parsed.risk_level),
                      width: `${Math.min(100, Math.max(0, Math.round((result.parsed.confidence ?? 0) * 100)))}%`,
                      transition: "width 0.6s cubic-bezier(0.4,0,0.2,1)",
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    color: getRiskAccentColor(result.parsed.risk_level),
                  }}
                >
                  {formatPercent(result.parsed.confidence)}
                </span>
              </div>
            </div>
          </>
        ) : (
          <ErrorState error="The backend replied, but the content was not in the expected format." />
        )}
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div style={{ padding: "32px 24px" }}>
      <p style={{ fontSize: 13, color: "var(--foreground-muted)" }}>No scan result yet.</p>
    </div>
  )
}

function ErrorState({ error }: { error: string }) {
  return (
    <div
      style={{
        padding: "24px",
        borderRadius: 10,
        background: "var(--risk-high-dim)",
        border: "0.5px solid var(--risk-high-border)",
        margin: 16,
      }}
    >
      <p
        style={{
          fontSize: 12,
          fontWeight: 500,
          color: "var(--risk-high)",
          marginBottom: 6,
          letterSpacing: "0.02em",
        }}
      >
        Error
      </p>
      <p style={{ fontSize: 13, color: "var(--foreground-secondary)", lineHeight: 1.6 }}>
        {error}
      </p>
    </div>
  )
}