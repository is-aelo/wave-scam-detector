"use client"

interface RiskSpectrumBarProps {
  score: number
  riskLevel: string
}

const STOPS = [
  { label: "Safe", color: "var(--risk-safe)", position: 0 },
  { label: "Low", color: "var(--risk-low)", position: 25 },
  { label: "Caution", color: "var(--risk-caution)", position: 50 },
  { label: "Suspicious", color: "var(--risk-suspicious)", position: 75 },
  { label: "High", color: "var(--risk-high)", position: 100 },
]

function getMarkerColor(score: number): string {
  if (score <= 20) return "var(--risk-safe)"
  if (score <= 40) return "var(--risk-low)"
  if (score <= 60) return "var(--risk-caution)"
  if (score <= 80) return "var(--risk-suspicious)"
  return "var(--risk-high)"
}

export function RiskSpectrumBar({ score, riskLevel }: RiskSpectrumBarProps) {
  const percentage = Math.min(Math.max(score, 0), 100)
  const markerColor = getMarkerColor(percentage)

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
            boxShadow: `0 0 0 2px rgba(${markerColor}, 0.2)`,
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