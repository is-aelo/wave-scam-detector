"use client";

import { FormEvent, useState } from "react";

type ParsedScan = {
  mode?: string;
  language_style?: string;
  tone?: string;
  summary?: string;
  risk_score?: number;
  risk_level?: string;
  confidence?: number;
  scam_type?: string;
  red_flags?: string[];
  what_could_happen?: string;
  recommendation?: string;
};

type ScanResponse =
  | {
      ok: true;
      rawText: string;
      parsed: unknown;
    }
  | {
      ok: false;
      error: string;
    };

type ScanMode = "message" | "link";

function isParsedScan(value: unknown): value is ParsedScan {
  return typeof value === "object" && value !== null;
}

function getRiskTone(riskLevel?: string) {
  switch (riskLevel) {
    case "High Risk":
      return "Immediate attention";
    case "Suspicious":
      return "Very likely unsafe";
    case "Caution":
      return "Worth checking carefully";
    case "Low Risk":
      return "Mostly okay, but still verify";
    case "Safe":
      return "Looks okay";
    default:
      return "Review needed";
  }
}

function formatPercent(value?: number) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "Unknown";
  }

  return `${Math.round(value * 100)}%`;
}

function ScanResultView({ result }: { result: ScanResponse | null }) {
  return (
    <aside className="rounded-3xl border border-foreground/15 bg-background p-6 shadow-sm">
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-foreground/60">Result</p>
          <h2 className="mt-1 text-2xl font-semibold">Wave&apos;s read</h2>
        </div>

        {!result ? (
          <div className="rounded-2xl border border-dashed border-foreground/15 bg-foreground/5 p-5 text-sm leading-6 text-foreground/75">
            No response yet. Submit either tab to test the backend.
          </div>
        ) : !result.ok ? (
          <div className="rounded-2xl border border-foreground/15 bg-foreground/5 p-5">
            <p className="text-sm font-medium text-foreground/60">
              Backend error
            </p>
            <p className="mt-2 text-base leading-7">{result.error}</p>
          </div>
        ) : isParsedScan(result.parsed) ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-foreground/15 bg-foreground/5 p-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-foreground/15 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em]">
                  {result.parsed.risk_level ?? "Unknown"}
                </span>
                <span className="text-sm text-foreground/70">
                  {getRiskTone(result.parsed.risk_level)}
                </span>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-foreground/10 bg-background p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-foreground/50">
                    Risk score
                  </p>
                  <p className="mt-2 text-2xl font-semibold">
                    {result.parsed.risk_score ?? "Unknown"}
                  </p>
                </div>

                <div className="rounded-2xl border border-foreground/10 bg-background p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-foreground/50">
                    Confidence
                  </p>
                  <p className="mt-2 text-2xl font-semibold">
                    {formatPercent(result.parsed.confidence)}
                  </p>
                </div>

                <div className="rounded-2xl border border-foreground/10 bg-background p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-foreground/50">
                    Scam type
                  </p>
                  <p className="mt-2 text-lg font-semibold leading-6">
                    {result.parsed.scam_type ?? "Unknown"}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <section className="rounded-2xl border border-foreground/15 bg-foreground/5 p-5">
                <p className="text-sm font-medium text-foreground/60">Summary</p>
                <p className="mt-2 text-base leading-7">
                  {result.parsed.summary ?? "No summary returned."}
                </p>
              </section>

              <section className="rounded-2xl border border-foreground/15 bg-foreground/5 p-5">
                <p className="text-sm font-medium text-foreground/60">
                  Why Wave flagged it
                </p>
                {result.parsed.red_flags?.length ? (
                  <ul className="mt-3 space-y-2 text-sm leading-6">
                    {result.parsed.red_flags.map((flag) => (
                      <li
                        key={flag}
                        className="rounded-xl border border-foreground/10 bg-background px-3 py-2"
                      >
                        {flag}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-base leading-7 text-foreground/75">
                    No red flags were returned.
                  </p>
                )}
              </section>

              <section className="rounded-2xl border border-foreground/15 bg-foreground/5 p-5">
                <p className="text-sm font-medium text-foreground/60">
                  What could happen if you proceed
                </p>
                <p className="mt-2 text-base leading-7">
                  {result.parsed.what_could_happen ??
                    "No scenario was returned."}
                </p>
              </section>

              <section className="rounded-2xl border border-foreground/15 bg-foreground/5 p-5">
                <p className="text-sm font-medium text-foreground/60">
                  Recommended next step
                </p>
                <p className="mt-2 text-base leading-7">
                  {result.parsed.recommendation ??
                    "No recommendation was returned."}
                </p>
              </section>
            </div>

            <details className="rounded-2xl border border-foreground/15 bg-background p-5">
              <summary className="cursor-pointer text-sm font-medium text-foreground/70">
                Raw backend payload
              </summary>
              <pre className="mt-4 overflow-auto text-xs leading-6 text-foreground/70">
                {JSON.stringify(result, null, 2)}
              </pre>
            </details>
          </div>
        ) : (
          <div className="rounded-2xl border border-foreground/15 bg-foreground/5 p-5">
            <p className="text-sm font-medium text-foreground/60">
              Unreadable response
            </p>
            <p className="mt-2 text-base leading-7">
              The backend replied, but the content was not in the expected
              format.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<ScanMode>("message");
  const [messageText, setMessageText] = useState(
    "Hi, can you complete this task first? We will pay after the next milestone.",
  );
  const [messageSource, setMessageSource] = useState(
    "Received from a new client on Facebook Messenger",
  );
  const [messageContext, setMessageContext] = useState("");
  const [messageEvidence, setMessageEvidence] = useState("");
  const [urlText, setUrlText] = useState("https://example.com/login");
  const [urlSource, setUrlSource] = useState(
    "Shared by someone I do not fully trust",
  );
  const [urlContext, setUrlContext] = useState("");
  const [urlEvidence, setUrlEvidence] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResponse | null>(null);

  async function submitScan(payload: {
    input_text: string;
    source?: string;
    url?: string;
    context?: string;
    evidence?: string;
  }) {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as ScanResponse;
      setResult(data);
    } catch (error) {
      setResult({
        ok: false,
        error:
          error instanceof Error ? error.message : "Failed to reach the backend.",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleMessageSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await submitScan({
      input_text: messageText,
      source: messageSource,
      context: messageContext,
      evidence: messageEvidence,
    });
  }

  async function handleLinkSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await submitScan({
      input_text: "Analyze this URL for scam or fraud risk.",
      source: urlSource,
      url: urlText,
      context: urlContext,
      evidence: urlEvidence,
    });
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6 lg:px-8">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.3em] text-foreground/60">
            Wave backend smoke test
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Send a message or check a link.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-foreground/75">
            Wave now has separate flows for message analysis and URL checks, so
            the user can give better context before the backend scan starts.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setActiveTab("message")}
            className={`rounded-full px-5 py-2 text-sm font-medium transition ${
              activeTab === "message"
                ? "bg-foreground text-background"
                : "border border-foreground/15 bg-background text-foreground/75"
            }`}
          >
            Message scan
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("link")}
            className={`rounded-full px-5 py-2 text-sm font-medium transition ${
              activeTab === "link"
                ? "bg-foreground text-background"
                : "border border-foreground/15 bg-background text-foreground/75"
            }`}
          >
            Link check
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          {activeTab === "message" ? (
            <form
              onSubmit={handleMessageSubmit}
              className="rounded-3xl border border-foreground/15 bg-foreground/5 p-6 shadow-sm"
            >
              <div className="space-y-5">
                <label className="block space-y-2">
                  <span className="text-sm font-medium">Message text</span>
                  <textarea
                    value={messageText}
                    onChange={(event) => setMessageText(event.target.value)}
                    rows={7}
                    className="w-full rounded-2xl border border-foreground/15 bg-background px-4 py-3 font-mono text-sm leading-6 outline-none transition focus:border-foreground/35"
                    placeholder="Paste a freelancer, job, or marketplace message here."
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-medium">Sender / source</span>
                  <input
                    value={messageSource}
                    onChange={(event) => setMessageSource(event.target.value)}
                    className="w-full rounded-2xl border border-foreground/15 bg-background px-4 py-3 text-sm outline-none transition focus:border-foreground/35"
                    placeholder="Example: received from a recruiter on LinkedIn"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-medium">Optional context</span>
                  <input
                    value={messageContext}
                    onChange={(event) => setMessageContext(event.target.value)}
                    className="w-full rounded-2xl border border-foreground/15 bg-background px-4 py-3 text-sm outline-none transition focus:border-foreground/35"
                    placeholder="Example: first message from a new client"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-medium">Optional evidence</span>
                  <input
                    value={messageEvidence}
                    onChange={(event) => setMessageEvidence(event.target.value)}
                    className="w-full rounded-2xl border border-foreground/15 bg-background px-4 py-3 text-sm outline-none transition focus:border-foreground/35"
                    placeholder="Example: suspicious profile link or screenshot text"
                  />
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex h-12 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Scanning..." : "Send to backend"}
                </button>
              </div>
            </form>
          ) : (
            <form
              onSubmit={handleLinkSubmit}
              className="rounded-3xl border border-foreground/15 bg-foreground/5 p-6 shadow-sm"
            >
              <div className="space-y-5">
                <label className="block space-y-2">
                  <span className="text-sm font-medium">URL</span>
                  <input
                    value={urlText}
                    onChange={(event) => setUrlText(event.target.value)}
                    className="w-full rounded-2xl border border-foreground/15 bg-background px-4 py-3 text-sm outline-none transition focus:border-foreground/35"
                    placeholder="Paste the link here"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-medium">Sender / source</span>
                  <input
                    value={urlSource}
                    onChange={(event) => setUrlSource(event.target.value)}
                    className="w-full rounded-2xl border border-foreground/15 bg-background px-4 py-3 text-sm outline-none transition focus:border-foreground/35"
                    placeholder="Example: shared in a group chat"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-medium">Optional context</span>
                  <input
                    value={urlContext}
                    onChange={(event) => setUrlContext(event.target.value)}
                    className="w-full rounded-2xl border border-foreground/15 bg-background px-4 py-3 text-sm outline-none transition focus:border-foreground/35"
                    placeholder="Example: asked to log in urgently"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-medium">Optional evidence</span>
                  <input
                    value={urlEvidence}
                    onChange={(event) => setUrlEvidence(event.target.value)}
                    className="w-full rounded-2xl border border-foreground/15 bg-background px-4 py-3 text-sm outline-none transition focus:border-foreground/35"
                    placeholder="Example: suspicious domain snippet"
                  />
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex h-12 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Checking link..." : "Check link"}
                </button>
              </div>
            </form>
          )}

          <ScanResultView result={result} />
        </div>
      </section>
    </main>
  );
}
