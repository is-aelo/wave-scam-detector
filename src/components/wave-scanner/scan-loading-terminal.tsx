"use client"

import { CircleNotch } from "@phosphor-icons/react"

import { Card, CardContent } from "@/components/ui/card"

export type LoadingStep = {
  label: string
  tone?: "default" | "blue" | "yellow" | "green"
}

type ScanLoadingTerminalProps = {
  commandLabel: string
  progress: number
  status: string
  steps: LoadingStep[]
  activeStepIndex: number
}

export function ScanLoadingTerminal({
  commandLabel,
  progress,
  status,
  steps,
  activeStepIndex,
}: ScanLoadingTerminalProps) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-2xl border-border-subtle bg-card shadow-[var(--shadow-card)]">
        <CardContent className="p-0">
          <div className="flex items-center justify-between border-b border-border-subtle bg-surface-secondary px-5 py-3">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-foreground-subtle" />
              <span className="h-2.5 w-2.5 rounded-full bg-foreground-subtle/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-foreground-subtle/50" />
            </div>
            <p className="text-xs font-medium text-foreground-muted">
              Analyzing
            </p>
          </div>

          <div className="space-y-5 p-5 sm:p-6">
            <div className="rounded-lg bg-background-elevated px-4 py-3 ring-1 ring-inset ring-border-subtle">
              <div className="flex items-center gap-2 font-mono text-xs text-primary">
                <span>~</span>
                <span>&gt;</span>
                <span className="min-w-0 flex-1 truncate text-foreground-secondary">
                  {commandLabel}
                </span>
                <span className="inline-block h-4 w-1 animate-pulse rounded-sm bg-primary/80" />
              </div>
            </div>

            <div className="space-y-2">
              {steps.map((step, index) => {
                const isActive = index <= activeStepIndex

                return (
                  <div
                    key={step.label}
                    className={`flex items-center gap-2 font-mono text-xs transition-opacity ${
                      isActive ? "opacity-100" : "opacity-35"
                    } ${stepTone(step.tone)}`}
                  >
                    <span className="text-foreground-subtle">&gt;</span>
                    <span>{step.label}</span>
                  </div>
                )
              })}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-4">
                <span className="truncate text-xs text-foreground-muted">
                  {status}
                </span>
                <span className="font-mono text-xs text-primary">
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-surface-tertiary">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300 ease-out"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-foreground-muted">
              <CircleNotch
                size={18}
                className="animate-spin text-primary"
                weight="bold"
              />
              <span>Running analysis</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function stepTone(tone?: LoadingStep["tone"]) {
  switch (tone) {
    case "blue":
      return "text-info"
    case "yellow":
      return "text-warning"
    case "green":
      return "text-safe"
    default:
      return "text-foreground-muted"
  }
}
