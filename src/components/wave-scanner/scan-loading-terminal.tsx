"use client"

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
    <div className="flex min-h-[50vh] items-center justify-center px-4 py-8 sm:min-h-[60vh] sm:py-12 lg:px-8">
      <Card className="w-full max-w-2xl border-border bg-card shadow-[var(--shadow-card)]">
        <CardContent className="p-0">
          <div className="flex items-center justify-between border-b border-border-subtle bg-surface-secondary px-5 py-3">
            <p className="text-xs font-medium text-foreground-muted">
              Analyzing
            </p>
          </div>

          <div className="space-y-5 p-5 sm:p-6">
            <div className="rounded-lg border border-border-subtle bg-background-elevated px-4 py-3">
              <div className="flex items-center gap-2 text-xs text-primary">
                <span>~</span>
                <span>&gt;</span>
                <span className="min-w-0 flex-1 truncate text-foreground-secondary">
                  {commandLabel}
                </span>
                <span className="inline-block h-4 w-0.5 animate-pulse rounded-sm bg-primary/80" />
              </div>
            </div>

            <div className="space-y-2">
              {steps.map((step, index) => {
                const isActive = index <= activeStepIndex

                return (
                  <div
                    key={step.label}
                    className={`flex items-center gap-2 text-xs transition-opacity ${
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
                <span className="text-xs font-medium text-primary">
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

            <div className="flex items-center gap-2 text-xs text-foreground-muted">
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              <span>Processing...</span>
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
      return "text-primary"
    case "yellow":
      return "text-warning"
    case "green":
      return "text-safe"
    default:
      return "text-foreground-muted"
  }
}
