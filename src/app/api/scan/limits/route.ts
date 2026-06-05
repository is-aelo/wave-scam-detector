import { getClientIp, getLimiter } from "@/lib/rate-limit"

export async function GET(request: Request) {
  const limiter = await getLimiter()
  const ip = getClientIp(request)
  const status = await limiter.check(ip)
  return Response.json({ ok: true, ...status })
}
