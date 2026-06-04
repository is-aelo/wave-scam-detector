export type ParsedScan = {
  mode?: string
  language_style?: string
  tone?: string
  summary?: string
  risk_score?: number
  risk_level?: string
  confidence?: number
  scam_type?: string
  red_flags?: string[]
  what_could_happen?: string
  recommendation?: string
}

export type ScanResponse =
  | {
      ok: true
      rawText: string
      parsed: unknown
    }
  | {
      ok: false
      error: string
    }

export type ScanMode = "message" | "link"

export function isParsedScan(value: unknown): value is ParsedScan {
  return typeof value === "object" && value !== null
}

export function getRiskTone(riskLevel?: string) {
  switch (riskLevel) {
    case "High Risk":
      return "Immediate attention"
    case "Suspicious":
      return "Very likely unsafe"
    case "Caution":
      return "Worth checking carefully"
    case "Low Risk":
      return "Mostly okay, but still verify"
    case "Safe":
      return "Looks okay"
    default:
      return "Review needed"
  }
}

export function formatPercent(value?: number) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "Unknown"
  }

  return `${Math.round(value * 100)}%`
}

export function getRiskLevelTone(riskLevel?: string) {
  switch (riskLevel) {
    case "Safe":
      return "bg-safe/10 text-safe border-safe/20"
    case "Low Risk":
      return "bg-info/10 text-info border-info/20"
    case "Caution":
      return "bg-warning/10 text-warning border-warning/20"
    case "Suspicious":
    case "High Risk":
      return "bg-danger/10 text-danger border-danger/20"
    default:
      return "bg-muted text-muted-foreground border-border"
  }
}

export function normalizeRiskScore(value: unknown): number {
  if (typeof value !== "number" || Number.isNaN(value)) return 0
  if (value > 0 && value <= 1) return Math.round(value * 100)
  return Math.min(100, Math.max(0, Math.round(value)))
}

export function getRiskLevelFromScore(score: number): string {
  if (score <= 15) return "Safe"
  if (score <= 35) return "Low Risk"
  if (score <= 55) return "Caution"
  if (score <= 75) return "Suspicious"
  return "High Risk"
}

const RISK_SEVERITY: Record<string, number> = {
  "Safe": 0,
  "Low Risk": 1,
  "Caution": 2,
  "Suspicious": 3,
  "High Risk": 4,
}

export function reconcileRiskLevel(aiLevel: string | undefined, score: number): string {
  const scoreLevel = getRiskLevelFromScore(score)
  const aIdx = RISK_SEVERITY[aiLevel ?? ""] ?? -1
  const sIdx = RISK_SEVERITY[scoreLevel] ?? -1
  if (aIdx === -1 && sIdx === -1) return "Safe"
  if (aIdx >= sIdx) return aiLevel!
  return scoreLevel
}

export function getRiskColor(riskLevel?: string) {
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

export function getRiskScoreTone(riskLevel?: string) {
  switch (riskLevel) {
    case "Safe":
      return "text-safe"
    case "Low Risk":
      return "text-info"
    case "Caution":
      return "text-warning"
    case "Suspicious":
    case "High Risk":
      return "text-danger"
    default:
      return "text-foreground"
  }
}
