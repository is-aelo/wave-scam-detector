"use client"

import { useRateLimits } from "@/lib/use-rate-limits"

export function RateLimitBadge() {
  const { perMinute: min, perDay: day, loading } = useRateLimits()

  if (loading || !min || !day) return null

  if (day.remaining <= 0) {
    return (
      <p className="border-t border-border px-5 pb-3.5 pt-2 text-2xs leading-relaxed text-danger">
        Daily limit reached — resets in {formatReset(day.reset)}
      </p>
    )
  }

  if (min.remaining <= 0) {
    return (
      <p className="border-t border-border px-5 pb-3.5 pt-2 text-2xs leading-relaxed text-warning">
        Limit resets in {formatReset(min.reset)}
      </p>
    )
  }

  const minText =
    min.remaining === 1
      ? "1 scan this minute"
      : `${min.remaining} scans this minute`
  const dayText =
    day.remaining === 1 ? "1 scan today" : `${day.remaining} scans today`

  return (
    <p className="border-t border-border px-5 pb-3.5 pt-2 text-2xs leading-relaxed text-foreground-subtle">
      {minText} · {dayText}
    </p>
  )
}

function formatReset(ts: number): string {
  const s = Math.ceil((ts - Date.now()) / 1000)
  if (s <= 0) return "now"
  if (s < 60) return `${s}s`
  const m = Math.ceil(s / 60)
  if (m < 60) return `${m}m`
  return `${Math.ceil(m / 60)}h`
}
