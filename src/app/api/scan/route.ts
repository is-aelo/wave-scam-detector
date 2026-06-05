import { runWaveScan } from "@/lib/wave-scan";
import { getClientIp, getLimiter } from "@/lib/rate-limit";

function isRateLimitError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const msg = error.message.toLowerCase();
  return (
    msg.includes("quota") ||
    msg.includes("exhausted") ||
    msg.includes("rate limit") ||
    msg.includes("429") ||
    msg.includes("too many requests") ||
    msg.includes("resource_exhausted")
  );
}

const RATE_LIMIT_MESSAGE =
  "Too many scans at once. Give it a few seconds, then tap try again.";
const DAILY_LIMIT_MESSAGE =
  "You've reached your scan limit for today. Come back tomorrow.";
const PROVIDER_LIMIT_MESSAGE =
  "The scan service is temporarily busy. Wait a moment and try again.";

function formatReset(reset: number): string {
  const seconds = Math.ceil((reset - Date.now()) / 1000);
  if (seconds <= 0) return "now";
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.ceil(seconds / 60);
  if (mins < 60) return `${mins}m`;
  return `${Math.ceil(mins / 60)}h`;
}

export async function POST(request: Request) {
  try {
    const limiter = await getLimiter();
    const ip = getClientIp(request);
    const { success, limit, remaining, reset } = await limiter.limit(ip);

    if (!success) {
      const isDayLimit = limit >= 50;
      return Response.json(
        {
          ok: false,
          error: isDayLimit ? `${DAILY_LIMIT_MESSAGE} (resets in ${formatReset(reset)})` : `${RATE_LIMIT_MESSAGE} (resets in ${formatReset(reset)})`,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil((reset - Date.now()) / 1000)),
            "X-RateLimit-Limit": String(limit),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(reset),
          },
        },
      );
    }

    const body = (await request.json().catch(() => null)) as
      | {
          input_text?: string;
          source?: string;
          url?: string;
          context?: string;
          evidence?: string;
          image_data?: string;
          image_mime_type?: string;
        }
      | null;

    const inputText = body?.input_text?.trim() ?? "";
    const source = body?.source?.trim();
    const url = body?.url?.trim();
    const context = body?.context?.trim();
    const evidence = body?.evidence?.trim();
    const imageData = body?.image_data?.trim();
    const imageMimeType = body?.image_mime_type?.trim();

    if (!inputText) {
      return Response.json(
        { ok: false, error: "Please paste a message or URL to scan." },
        { status: 400 },
      );
    }

    const result = await runWaveScan({
      inputText,
      source,
      url,
      context,
      evidence,
      imageData,
      imageMimeType,
    });

    return Response.json(result, {
      headers: {
        "X-RateLimit-Limit": String(limit),
        "X-RateLimit-Remaining": String(remaining),
        "X-RateLimit-Reset": String(reset),
      },
    });
  } catch (error) {
    const isProviderLimited = isRateLimitError(error);

    return Response.json(
      {
        ok: false,
        error: isProviderLimited
          ? PROVIDER_LIMIT_MESSAGE
          : "Couldn't finish the scan. Double-check your input and try again.",
      },
      { status: isProviderLimited ? 429 : 500 },
    );
  }
}
