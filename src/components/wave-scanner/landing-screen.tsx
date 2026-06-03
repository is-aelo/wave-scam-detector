"use client"

import {
  ArrowRight,
  ChatCenteredText,
  GlobeHemisphereWest,
  LinkSimple,
  Lightning,
  ShieldCheck,
} from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import { LandingDemo } from "@/components/wave-scanner/landing-demo"

type LandingScreenProps = {
  onCheckMessage: () => void
  onCheckUrl: () => void
}

const trustItems = [
  {
    icon: ShieldCheck,
    value: "No account required",
    label: "Quick scans without signing up",
  },
  {
    icon: Lightning,
    value: "< 3 sec",
    label: "Average scan time",
  },
  {
    icon: GlobeHemisphereWest,
    value: "EN / FIL",
    label: "Taglish-aware detection",
  },
]

const features = [
  {
    icon: ChatCenteredText,
    title: "Message analysis",
    description:
      "Paste suspicious text from job offers, DMs, emails, or marketplace listings.",
  },
  {
    icon: LinkSimple,
    title: "URL inspection",
    description:
      "Check links for phishing domains, redirect chains, and suspicious trust signals.",
  },
  {
    icon: ShieldCheck,
    title: "Actionable guidance",
    description:
      "Get a concise risk score, red flags, and next steps before you proceed.",
  },
]

export function LandingScreen({
  onCheckMessage,
  onCheckUrl,
}: LandingScreenProps) {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 pb-16 pt-14 sm:px-6 sm:pt-20 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-border bg-primary-dim px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-primary">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
          Scam risk assistant
        </div>

        <h1 className="text-4xl font-semibold leading-tight tracking-normal text-balance sm:text-5xl lg:text-[52px]">
          Know if it&apos;s a scam before you respond.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-[15px] leading-7 text-foreground-secondary">
          Wave analyzes suspicious messages and links for pressure tactics,
          phishing patterns, and context-aware risk signals.
        </p>
      </div>

      <div className="mt-10 sm:mt-12">
        <LandingDemo />
      </div>

      <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
        <Button
          size="lg"
          className="h-11 rounded-lg px-5"
          onClick={onCheckMessage}
        >
          Check a message
          <ArrowRight size={16} weight="bold" />
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="h-11 rounded-lg border-border bg-transparent px-5 shadow-none hover:bg-surface-secondary"
          onClick={onCheckUrl}
        >
          <LinkSimple size={18} weight="duotone" />
          Check a link
        </Button>
      </div>

      <div className="mx-auto mt-12 grid max-w-3xl gap-4 border-t border-border-subtle pt-7 sm:grid-cols-3">
        {trustItems.map((item) => {
          const Icon = item.icon

          return (
            <div key={item.value} className="flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border-subtle bg-surface">
                <Icon size={16} className="text-foreground-muted" />
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {item.value}
                </p>
                <p className="text-xs text-foreground-muted">{item.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mx-auto mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon

          return (
            <article
              key={feature.title}
              className="rounded-xl border border-border-subtle bg-card p-5 shadow-[var(--shadow-soft)]"
            >
              <span className="mb-4 flex h-8 w-8 items-center justify-center rounded-md border border-primary-border bg-primary-dim">
                <Icon size={16} className="text-primary" />
              </span>
              <h2 className="text-sm font-medium text-foreground">
                {feature.title}
              </h2>
              <p className="mt-2 text-xs leading-6 text-foreground-muted">
                {feature.description}
              </p>
            </article>
          )
        })}
      </div>
    </section>
  )
}
