"use client"

import { useEffect, useMemo, useState } from "react"
import { PaperPlaneTilt, ShieldCheck, WarningCircle } from "@phosphor-icons/react"

const SAMPLE_MESSAGE =
  "Hi! We're hiring for remote data entry positions. $3,500/month salary. Just pay a $50 refundable deposit for your equipment and training kit. Contact us on Telegram."

const signalRows = [
  ["Pressure tactic", "Urgency to pay deposit", "text-warning"],
  ["Suspicious pattern", "Upfront fee request", "text-warning"],
  ["Employment scam", "Advance-fee scheme", "text-foreground-secondary"],
  ["Risk score", "74 / 100", "text-warning"],
  ["Confidence", "High (83%)", "text-primary"],
]

type DemoPhase = "typing" | "sent" | "analyzing" | "result"

export function LandingDemo() {
  const [phase, setPhase] = useState<DemoPhase>("typing")
  const [typedCount, setTypedCount] = useState(0)
  const [scanIndex, setScanIndex] = useState(0)

  const typedMessage = useMemo(
    () => SAMPLE_MESSAGE.slice(0, typedCount),
    [typedCount],
  )

  useEffect(() => {
    if (phase === "typing") {
      const interval = window.setInterval(() => {
        setTypedCount((current) => {
          if (current >= SAMPLE_MESSAGE.length) {
            window.clearInterval(interval)
            window.setTimeout(() => setPhase("sent"), 420)
            return SAMPLE_MESSAGE.length
          }

          return current + 1
        })
      }, 22)

      return () => window.clearInterval(interval)
    }

    if (phase === "sent") {
      const timeout = window.setTimeout(() => {
        setScanIndex(0)
        setPhase("analyzing")
      }, 850)

      return () => window.clearTimeout(timeout)
    }

    if (phase === "analyzing") {
      const interval = window.setInterval(() => {
        setScanIndex((current) => {
          if (current >= signalRows.length) {
            window.clearInterval(interval)
            window.setTimeout(() => setPhase("result"), 500)
            return signalRows.length
          }

          return current + 1
        })
      }, 380)

      return () => window.clearInterval(interval)
    }

    const timeout = window.setTimeout(() => {
      setTypedCount(0)
      setScanIndex(0)
      setPhase("typing")
    }, 4500)

    return () => window.clearTimeout(timeout)
  }, [phase])

  const showAnalysis = phase === "analyzing" || phase === "result"
  const showResult = phase === "result"

  return (
    <div className="relative mx-auto w-full max-w-[580px]">
      <div className="relative overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex items-center gap-3 border-b border-border-subtle bg-surface-secondary px-4 py-3">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-danger/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-safe/70" />
          </div>
          <p className="flex-1 text-center text-xs text-foreground-muted">
            Wave Scan
          </p>
          <ShieldCheck size={13} weight="fill" className="text-primary" />
        </div>

        <div className="space-y-4 p-4">
          <div className="rounded-xl border border-border-subtle bg-background-elevated p-3.5">
            <div className="mb-2.5 flex items-center justify-between">
              <span className="text-xs font-medium text-foreground-muted">
                Message to analyze
              </span>
              <span className="rounded-md border border-border-subtle bg-surface px-2 py-0.5 text-2xs text-foreground-subtle">
                Messenger
              </span>
            </div>

            <div className="min-h-[72px] rounded-lg bg-surface p-3 text-sm leading-6 text-foreground-secondary">
              {typedMessage || (
                <span className="text-foreground-subtle/50">Typing a message...</span>
              )}
              {phase === "typing" ? (
                <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse rounded-sm bg-primary align-middle" />
              ) : null}
            </div>

            <div className="mt-3 flex items-center gap-2">
              <div className="h-9 flex-1 rounded-lg border border-border-subtle bg-surface px-3 text-xs text-foreground-subtle flex items-center">
                {phase === "typing" ? "Paste a suspicious message..." : SAMPLE_MESSAGE.length > 0 ? `${SAMPLE_MESSAGE.length} characters` : ""}
              </div>
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-300 ${
                  phase === "typing"
                    ? "bg-surface-tertiary text-foreground-subtle"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                <PaperPlaneTilt size={15} weight="fill" />
              </div>
            </div>
          </div>

          <div
            className={`rounded-xl border border-border-subtle bg-background-elevated p-3.5 transition-all duration-500 ${
              showAnalysis ? "opacity-100" : "opacity-50"
            }`}
          >
            <div className="mb-3 flex items-center gap-2 border-b border-border-subtle pb-2.5">
              <ShieldCheck size={14} weight="fill" className="text-primary" />
              <span className="text-xs font-medium text-foreground">
                Analysis results
              </span>
              {phase === "analyzing" && (
                <span className="ml-auto text-2xs text-foreground-muted">
                  Scanning signals...
                </span>
              )}
              {showResult && (
                <span className="ml-auto text-2xs text-safe">Complete</span>
              )}
            </div>

            {showAnalysis ? (
              <div className="space-y-1.5">
                {signalRows.map(([label, value, tone], index) => (
                  <div
                    key={label}
                    className={`grid grid-cols-[120px,1fr] gap-2 text-xs transition-all duration-300 ${
                      index < scanIndex
                        ? "translate-x-0 opacity-100"
                        : "-translate-x-2 opacity-0"
                    }`}
                    style={{
                      transitionDelay: index < scanIndex ? `${index * 40}ms` : "0ms",
                    }}
                  >
                    <span className="text-foreground-subtle">{label}</span>
                    <span className={`font-medium ${tone}`}>{value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-xs text-foreground-subtle">
                Waiting for message
              </span>
            )}

            <div
              className={`mt-3 overflow-hidden rounded-lg border border-warning-border bg-warning-dim transition-all duration-500 ease-out ${
                showResult
                  ? "max-h-40 translate-y-0 opacity-100"
                  : "max-h-0 translate-y-1 opacity-0"
              }`}
            >
              <div className="p-3.5">
                <div className="mb-2 flex items-center gap-1.5">
                  <WarningCircle size={14} weight="fill" className="text-warning" />
                  <span className="text-[10px] font-medium uppercase tracking-wider text-warning">
                    Warn — Suspicious
                  </span>
                </div>
                <p className="text-sm font-medium text-foreground">
                  Likely an advance-fee job scam
                </p>
                <p className="mt-1 text-xs leading-5 text-foreground-muted">
                  Multiple red flags detected: upfront payment request, unrealistic salary, and pressure tactics. Do not send money or share personal information.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
