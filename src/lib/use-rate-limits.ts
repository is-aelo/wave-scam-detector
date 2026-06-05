"use client"

import { useEffect, useState } from "react"

type RateLimitWindow = {
  limit: number
  remaining: number
  reset: number
}

type LimitStatus = {
  ok: true
  perMinute: RateLimitWindow
  perDay: RateLimitWindow
}

const POLL_INTERVAL = 30_000

export function useRateLimits() {
  const [perMinute, setPerMinute] = useState<RateLimitWindow | null>(null)
  const [perDay, setPerDay] = useState<RateLimitWindow | null>(null)
  const [loading, setLoading] = useState(true)
  const [, tick] = useState(0)

  useEffect(() => {
    let active = true

    async function fetchLimits() {
      try {
        const res = await fetch("/api/scan/limits")
        if (!res.ok) return
        const data = (await res.json()) as LimitStatus
        if (!active) return
        setPerMinute(data.perMinute)
        setPerDay(data.perDay)
      } catch {
        /* silently fail */
      } finally {
        if (active) setLoading(false)
      }
    }

    fetchLimits()
    const poll = setInterval(fetchLimits, POLL_INTERVAL)
    const ticker = setInterval(() => tick((n) => n + 1), 1000)

    return () => {
      active = false
      clearInterval(poll)
      clearInterval(ticker)
    }
  }, [])

  const limited =
    perMinute && perMinute.remaining <= 0
      ? ("minute" as const)
      : perDay && perDay.remaining <= 0
        ? ("day" as const)
        : null

  return { perMinute, perDay, limited, loading }
}
