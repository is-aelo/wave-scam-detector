export type RateLimitInfo = {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

export type Limiter = {
  limit: (identifier: string) => Promise<RateLimitInfo>
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) {
    const ip = forwarded.split(",")[0]?.trim()
    if (ip) return ip
  }
  return request.headers.get("x-real-ip") ?? "unknown"
}

const PER_MIN = Number(process.env.RATE_LIMIT_PER_MIN) || 1
const PER_DAY = Number(process.env.RATE_LIMIT_PER_DAY) || 3

// ── In-memory fallback (local dev) ──────────────────────────────────

function createMemoryLimiter(perMin: number, perDay: number): Limiter {
  const store = new Map<string, number[]>()
  const DAY_MS = 86_400_000
  const MIN_MS = 60_000

  setInterval(() => {
    const cutoff = Date.now() - DAY_MS
    for (const [key, timestamps] of store) {
      const active = timestamps.filter(t => t > cutoff)
      if (active.length === 0) store.delete(key)
      else store.set(key, active)
    }
  }, 300_000)

  return {
    async limit(identifier: string) {
      const now = Date.now()
      let timestamps = store.get(identifier) ?? []
      timestamps = timestamps.filter(t => t > now - DAY_MS)

      const minuteEntries = timestamps.filter(t => t > now - MIN_MS)

      if (minuteEntries.length >= perMin) {
        return {
          success: false,
          limit: perMin,
          remaining: 0,
          reset: minuteEntries[0]! + MIN_MS,
        }
      }

      if (timestamps.length >= perDay) {
        return {
          success: false,
          limit: perDay,
          remaining: 0,
          reset: timestamps[0]! + DAY_MS,
        }
      }

      timestamps.push(now)
      store.set(identifier, timestamps)

      return {
        success: true,
        limit: perMin,
        remaining: perMin - minuteEntries.length - 1,
        reset: now + MIN_MS,
      }
    },
  }
}

// ── Upstash Redis (production / Vercel) ─────────────────────────────

async function createUpstashLimiter(perMin: number, perDay: number): Promise<Limiter> {
  const { Ratelimit } = await import("@upstash/ratelimit")
  const { Redis } = await import("@upstash/redis")

  const redis =
    process.env.KV_REST_API_URL || process.env.KV_URL
      ? Redis.fromEnv()
      : new Redis({
          url: process.env.UPSTASH_REDIS_REST_URL!,
          token: process.env.UPSTASH_REDIS_REST_TOKEN!,
        })

  const minuteLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(perMin, "60 s"),
    analytics: true,
    prefix: "wave:ratelimit:min",
  })

  const dayLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(perDay, "1 d"),
    analytics: true,
    prefix: "wave:ratelimit:day",
  })

  return {
    async limit(identifier: string) {
      const [minResult, dayResult] = await Promise.all([
        minuteLimiter.limit(identifier),
        dayLimiter.limit(identifier),
      ])

      const failed = !minResult.success ? minResult : !dayResult.success ? dayResult : null
      if (failed) {
        return {
          success: false,
          limit: failed.limit,
          remaining: 0,
          reset: failed.reset,
        }
      }

      return {
        success: true,
        limit: minResult.limit,
        remaining: Math.min(minResult.remaining, dayResult.remaining),
        reset: Math.min(minResult.reset, dayResult.reset),
      }
    },
  }
}

// ── Singleton ───────────────────────────────────────────────────────

let _limiter: Limiter | null = null

export async function getLimiter(): Promise<Limiter> {
  if (_limiter) return _limiter

  const useUpstash = !!(
    process.env.KV_REST_API_URL ??
    process.env.KV_URL ??
    process.env.UPSTASH_REDIS_REST_URL
  )

  _limiter = useUpstash
    ? await createUpstashLimiter(PER_MIN, PER_DAY)
    : createMemoryLimiter(PER_MIN, PER_DAY)

  return _limiter
}
