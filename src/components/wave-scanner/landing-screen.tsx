"use client"

import { useCallback, useEffect, useRef, useState } from "react"

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
  const sectionRef = useRef<HTMLElement>(null)
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.15 })
  const [canTrack, setCanTrack] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine) and (min-width: 768px)")
    setCanTrack(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setCanTrack(e.matches)
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  const handleMouse = useCallback((e: React.MouseEvent) => {
    if (!sectionRef.current) return
    const rect = sectionRef.current.getBoundingClientRect()
    setMouse({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    })
  }, [])

  return (
    <section
      ref={sectionRef}
      onMouseMove={canTrack ? handleMouse : undefined}
      className="relative mx-auto w-full max-w-5xl px-4 pb-12 pt-10 sm:px-6 sm:pt-16 lg:px-8"
    >
      {canTrack && (
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background: `radial-gradient(600px circle at ${mouse.x * 100}% ${mouse.y * 100}%, rgba(74,106,138,0.08), transparent 50%)`,
          }}
        />
      )}

      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-balance text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          Know if it&apos;s a scam before you respond.
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-[15px] leading-6 text-foreground-secondary">
          Wave analyzes suspicious messages and links for pressure tactics,
          phishing patterns, and context-aware risk signals.
        </p>
      </div>

      <div className="mx-auto mt-8 w-full max-w-[580px]">
        <LandingDemo />
      </div>

      <div className="mt-6 flex flex-col items-stretch justify-center gap-2 sm:flex-row sm:items-center sm:gap-3">
        <Button
          size="lg"
          className="h-11 w-full sm:w-auto rounded-lg px-5"
          onClick={onCheckMessage}
        >
          Check a message
          <ArrowRight size={16} weight="bold" />
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="h-11 w-full sm:w-auto rounded-lg border-border bg-transparent px-5 shadow-none hover:bg-surface-secondary"
          onClick={onCheckUrl}
        >
          <LinkSimple size={18} weight="duotone" />
          Check a link
        </Button>
      </div>

      {/* Bento stat bar — trust metrics */}
      <div className="mx-auto mt-10 max-w-3xl rounded-xl border border-border-card bg-background-elevated p-4 shadow-[var(--shadow-elevation-mid)] sm:p-5">
        <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
          {trustItems.map((item) => {
            const Icon = item.icon

            return (
              <div key={item.value} className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-secondary">
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
      </div>

      {/* Bento feature cards */}
      <div className="mx-auto mt-6 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
        {features.map((feature, index) => {
          const Icon = feature.icon
          const isPrimary = index === 0

          return (
            <article
              key={feature.title}
              className={`rounded-xl ${
                isPrimary
                  ? "border border-border-card bg-background-elevated shadow-[var(--shadow-elevation-mid)] sm:col-span-2 sm:p-6"
                  : "bg-surface-secondary sm:p-5"
              } p-5`}
            >
              <span
                className={`mb-3 flex items-center justify-center rounded-lg ${
                  isPrimary
                    ? "border border-accent-brand-border bg-accent-brand-dim shadow-[var(--accent-chrome-glow)] h-9 w-9 sm:h-10 sm:w-10"
                    : "bg-accent-brand-dim h-8 w-8"
                }`}
              >
                <Icon
                  size={isPrimary ? 18 : 14}
                  className="text-accent-brand"
                />
              </span>
              <h2
                className={`font-semibold text-foreground ${
                  isPrimary ? "text-base sm:text-lg" : "text-sm"
                }`}
              >
                {feature.title}
              </h2>
              <p
                className={`mt-1.5 leading-6 text-foreground-muted ${
                  isPrimary ? "text-sm" : "text-xs"
                }`}
              >
                {feature.description}
              </p>
            </article>
          )
        })}
      </div>
    </section>
  )
}
