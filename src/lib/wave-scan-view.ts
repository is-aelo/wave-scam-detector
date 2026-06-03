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
