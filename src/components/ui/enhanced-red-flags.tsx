"use client"

interface EnhancedRedFlagsProps {
  flags: string[]
  riskLevel: string
}

function getRiskColor(riskLevel: string): string {
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

export function EnhancedRedFlags({ flags, riskLevel }: EnhancedRedFlagsProps) {
  const accentColor = getRiskColor(riskLevel)

  if (!flags || flags.length === 0) {
    return (
      <p
        style={{
          fontSize: 13,
          color: "var(--foreground-muted)",
          padding: "12px 0",
        }}
      >
        No red flags detected.
      </p>
    )
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {flags.map((flag, index) => (
        <div
          key={`${flag}-${index}`}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 14,
          }}
        >
          <span
            style={{
              fontSize: 10,
              fontFamily: "var(--font-mono, monospace)",
              fontWeight: 500,
              color: accentColor,
              letterSpacing: "0.04em",
              paddingTop: 2,
              minWidth: 18,
              flexShrink: 0,
              opacity: 0.7,
            }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <span
            style={{
              fontSize: 13,
              color: "var(--foreground-secondary)",
              lineHeight: 1.6,
            }}
          >
            {flag}
          </span>
        </div>
      ))}
    </div>
  )
}