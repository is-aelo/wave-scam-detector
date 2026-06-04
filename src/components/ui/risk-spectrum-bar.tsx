"use client"

import { getRiskColor } from "@/lib/wave-scan-view"

interface RiskSpectrumBarProps {
  score: number
  riskLevel: string
}

function getRiskBorder(riskLevel: string): string {
  switch (riskLevel) {
    case "Safe":
      return "var(--risk-safe-border)"
    case "Low Risk":
      return "var(--risk-low-border)"
    case "Caution":
      return "var(--risk-caution-border)"
    case "Suspicious":
      return "var(--risk-suspicious-border)"
    case "High Risk":
      return "var(--risk-high-border)"
    default:
      return "var(--risk-safe-border)"
  }
}

const STOPS = [
  { label: "Safe", color: "var(--risk-safe)", position: 0 },
  { label: "Low", color: "var(--risk-low)", position: 25 },
  { label: "Caution", color: "var(--risk-caution)", position: 50 },
  { label: "Suspicious", color: "var(--risk-suspicious)", position: 75 },
  { label: "High", color: "var(--risk-high)", position: 100 },
]

export function RiskSpectrumBar({ score, riskLevel }: RiskSpectrumBarProps) {
  const percentage = Math.min(Math.max(score, 0), 100)
  const markerColor = getRiskColor(riskLevel)

  return (
    <div>
      <div style={{ position: "relative", height: 20, display: "flex", alignItems: "center" }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: 2,
            borderRadius: 99,
            background: "rgba(255,255,255,0.06)",
          }}
        />

        {STOPS.map((stop) => (
          <div
            key={stop.label}
            style={{
              position: "absolute",
              left: `${stop.position}%`,
              transform: "translateX(-50%)",
              width: 3,
              height: 3,
              borderRadius: "50%",
              background: stop.color,
              opacity: 0.4,
            }}
          />
        ))}

        <div
          style={{
            position: "absolute",
            left: `${percentage}%`,
            transform: "translateX(-50%)",
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: markerColor,
            boxShadow: `0 0 0 2px ${getRiskBorder(riskLevel)}`,
            transition: "left 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
            zIndex: 1,
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 8,
        }}
      >
        {STOPS.map((stop) => (
          <span
            key={stop.label}
            style={{
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: "0.04em",
              color: "var(--foreground-subtle)",
              textTransform: "uppercase",
            }}
          >
            {stop.label}
          </span>
        ))}
      </div>
    </div>
  )
}