"use client"

import { useEffect, useMemo, useState } from "react"
import { ArrowUp, CircleNotch } from "@phosphor-icons/react"

const SAMPLE_MESSAGE =
  "Hi po, hiring na kami. Work from home setup. Kailangan lang magbayad ng P1,500 para sa training kit."

const scanRows = [
  ["status", "complete", "text-safe"],
  ["risk_score", "74 / 100", "text-warning"],
  ["risk_level", "SUSPICIOUS", "text-warning"],
  ["scam_type", "advance-fee job", "text-foreground-secondary"],
  ["confidence", "83%", "text-primary"],
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
      }, 24)

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
          if (current >= scanRows.length) {
            window.clearInterval(interval)
            window.setTimeout(() => setPhase("result"), 500)
            return scanRows.length
          }

          return current + 1
        })
      }, 360)

      return () => window.clearInterval(interval)
    }

    const timeout = window.setTimeout(() => {
      setTypedCount(0)
      setScanIndex(0)
      setPhase("typing")
    }, 3400)

    return () => window.clearTimeout(timeout)
  }, [phase])

  const showTerminal = phase === "analyzing" || phase === "result"
  const showResult = phase === "result"

  return (
    <div className="relative mx-auto w-full max-w-[580px]">
      <div className="absolute -inset-6 rounded-[28px] bg-primary/10 blur-3xl" />
      <div className="relative overflow-hidden rounded-xl border border-border-subtle bg-card shadow-[var(--shadow-glow)]">
        <div className="flex items-center gap-3 border-b border-border-subtle bg-surface-secondary px-4 py-3">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-danger/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-safe/70" />
          </div>
          <p className="flex-1 text-center font-mono text-[11px] text-foreground-subtle">
            wave - scan result
          </p>
        </div>

        <div className="space-y-4 p-4">
          <div className="rounded-lg border border-border-subtle bg-background-elevated p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-foreground-muted">
                Message
              </span>
              <span className="font-mono text-[10px] text-foreground-subtle">
                Messenger
              </span>
            </div>

            <div className="min-h-20 rounded-lg bg-surface p-3 text-sm leading-6 text-foreground-secondary">
              {typedMessage}
              {phase === "typing" ? (
                <span className="ml-0.5 inline-block h-4 w-1 animate-pulse rounded-sm bg-primary align-middle" />
              ) : null}
            </div>

            <div className="mt-3 flex items-center gap-2">
              <div className="h-8 flex-1 rounded-lg border border-border-subtle bg-surface" />
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                  phase === "typing"
                    ? "bg-surface-tertiary text-foreground-subtle"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                <ArrowUp size={15} weight="bold" />
              </div>
            </div>
          </div>

          <div
            className={`space-y-3 rounded-lg border border-border-subtle bg-background-elevated p-3 transition-opacity duration-300 ${
              showTerminal ? "opacity-100" : "opacity-45"
            }`}
          >
            <div className="flex min-w-0 items-center gap-2 font-mono text-[11px]">
              <span className="text-primary">~</span>
              <span className="text-primary">&gt;</span>
              <span className="text-foreground">wave scan</span>
              <span className="truncate text-foreground-muted">
                &quot;Hi po, hiring na kami...&quot;
              </span>
              <span className="hidden text-warning sm:inline">
                --mode job-seeker
              </span>
            </div>

            {showTerminal ? (
              <div className="space-y-1">
                {scanRows.map(([key, value, tone], index) => (
                  <div
                    key={key}
                    className={`grid grid-cols-[88px,1fr] gap-3 font-mono text-[11px] transition-opacity ${
                      index < scanIndex ? "opacity-100" : "opacity-25"
                    }`}
                  >
                    <span className="text-foreground-subtle">{key}</span>
                    <span className={tone}>{value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-foreground-subtle">
                <CircleNotch size={14} className="animate-spin" />
                Waiting for message
              </div>
            )}

            <div
              className={`rounded-r-md border border-warning-border border-l-warning bg-warning-dim p-3 transition-all duration-300 ${
                showResult
                  ? "translate-y-0 opacity-100"
                  : "translate-y-1 opacity-0"
              }`}
            >
              <p className="font-mono text-[10px] uppercase tracking-wider text-warning">
                Warn - suspicious
              </p>
              <p className="mt-1 text-sm font-medium text-foreground">
                Likely a job scam. Do not proceed.
              </p>
              <p className="mt-1 text-xs leading-5 text-foreground-muted">
                Multiple patterns match advance-fee scams. Avoid sharing
                personal info or paying fees.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
