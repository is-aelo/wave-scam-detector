"use client"

import { Suspense, useState, type FormEvent } from "react"
import { useRouter, useSearchParams } from "next/navigation"


import { LinkScanForm } from "@/components/wave-scanner/link-scan-form"
import { MessageScanForm } from "@/components/wave-scanner/message-scan-form"
import { ScanLoadingTerminal } from "@/components/wave-scanner/scan-loading-terminal"
import { ScanTabs } from "@/components/wave-scanner/scan-tabs"
import { ScannerNav } from "@/components/wave-scanner/scanner-nav"
import type { LoadingStep } from "@/components/wave-scanner/scan-loading-terminal"
import type { ScanMode, ScanResponse } from "@/lib/wave-scan-view"
import { useScanStore } from "@/lib/scan-store"
import { useRateLimits } from "@/lib/use-rate-limits"

const loadingSteps: LoadingStep[] = [
  { label: "Parsing input structure...", tone: "blue" },
  { label: "Checking language and tone...", tone: "blue" },
  { label: "Running pattern analysis...", tone: "yellow" },
  { label: "Identifying red flags...", tone: "yellow" },
  { label: "Scoring risk level...", tone: "green" },
  { label: "Generating recommendation...", tone: "green" },
]

const loadingProgress = [10, 25, 38, 52, 67, 80, 95]

function ScanPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setResult } = useScanStore()

  const modeParam = searchParams.get("mode")
  const initialTab: ScanMode = modeParam === "link" ? "link" : "message"

  const [activeTab, setActiveTab] = useState<ScanMode>(initialTab)
  const [messageText, setMessageText] = useState("")
  const [messageSource, setMessageSource] = useState("")
  const [messageEvidence, setMessageEvidence] = useState("")
  const [messageAttachment, setMessageAttachment] = useState<File | null>(null)
  const [urlText, setUrlText] = useState("")
  const [urlSource, setUrlSource] = useState("")
  const [urlContext, setUrlContext] = useState("")
  const [urlEvidence, setUrlEvidence] = useState("")
  const [urlAttachment, setUrlAttachment] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingProgressValue, setLoadingProgressValue] = useState(0)
  const [loadingStepIndex, setLoadingStepIndex] = useState(0)
  const [loadingCommand, setLoadingCommand] = useState('wave scan "..."')
  const [loadingStatus, setLoadingStatus] = useState(
    "Running analysis - this takes a few seconds",
  )
  const { limited } = useRateLimits()

  async function fetchScan(payload: {
    input_text: string
    source?: string
    url?: string
    context?: string
    evidence?: string
    image_data?: string
    image_mime_type?: string
  }): Promise<ScanResponse> {
    try {
      const response = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      return (await response.json()) as ScanResponse
    } catch (error) {
      return {
        ok: false,
        error: error instanceof Error ? error.message : "Failed to reach the backend.",
      } as const
    }
  }

  async function runScan(
    payload: {
      input_text: string
      source?: string
      url?: string
      context?: string
      evidence?: string
      image_data?: string
      image_mime_type?: string
    },
    mode: ScanMode,
    commandLabel: string,
  ) {
    setLoading(true)
    setLoadingProgressValue(0)
    setLoadingStepIndex(0)
    setLoadingStatus("Running analysis - this takes a few seconds")
    setLoadingCommand(commandLabel)

    let stepPointer = 0
    const timer = window.setInterval(() => {
      stepPointer = Math.min(stepPointer + 1, loadingSteps.length - 1)
      setLoadingStepIndex(stepPointer)
      setLoadingProgressValue(loadingProgress[stepPointer] ?? 95)
      setLoadingStatus(loadingSteps[stepPointer]?.label ?? "Running analysis")
    }, 360)

    const minDelay = sleep(2200)
    const scanPromise = fetchScan(payload)
    const response = await scanPromise

    window.clearInterval(timer)

    if (!response.ok) {
      setLoading(false)
      const id = setResult(response, mode)
      router.push(`/scan/result?id=${id}`)
      return
    }

    await minDelay
    setLoadingStepIndex(loadingSteps.length - 1)
    setLoadingProgressValue(100)
    setLoadingStatus("Analysis complete - loading result")

    await sleep(250)
    const id = setResult(response, mode)
    router.push(`/scan/result?id=${id}`)
  }

  async function handleMessageSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const image_data = messageAttachment ? await fileToBase64(messageAttachment) : undefined
    const image_mime_type = messageAttachment?.type
    await runScan(
      {
        input_text: messageText,
        source: messageSource || undefined,
        evidence: messageEvidence || undefined,
        image_data,
        image_mime_type,
      },
      "message",
      `wave scan "${shorten(messageText)}" --mode message`,
    )
  }

  async function handleLinkSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const image_data = urlAttachment ? await fileToBase64(urlAttachment) : undefined
    const image_mime_type = urlAttachment?.type
    await runScan(
      {
        input_text: "Analyze this URL for scam or fraud risk.",
        source: urlSource || undefined,
        url: urlText,
        context: urlContext || undefined,
        evidence: urlEvidence || undefined,
        image_data,
        image_mime_type,
      },
      "link",
      `wave scan "${shorten(urlText)}" --mode url`,
    )
  }

  function handleTabChange(tab: ScanMode) {
    setActiveTab(tab)
    router.replace(`/scan?mode=${tab}`)
  }

  const tips = activeTab === "message"
    ? [
        { title: "Paste the full message", description: "Details, numbers, and specific claims help Wave identify patterns." },
        { title: "Select the platform", description: "Different platforms have different scam profiles." },
        { title: "Add context", description: "Mention anything unusual about the sender or situation." },
        { title: "Attach a screenshot", description: "Include the conversation, message, job post, or marketplace for deeper analysis." },
      ]
    : [
        { title: "Use the full URL", description: "Include https:// and the complete path for accurate analysis." },
        { title: "Mention the source", description: "Where the link appeared helps determine the threat model." },
        { title: "Describe the context", description: "What happened around the link — urgency, promises, threats." },
        { title: "Screenshots help", description: "Capture the page or message surrounding the link." },
      ]

  return (
    <>
      <ScannerNav />
      <main className="min-h-screen text-foreground bg-background animate-page-enter">
        {loading ? (
          <ScanLoadingTerminal
            commandLabel={loadingCommand}
            progress={loadingProgressValue}
            status={loadingStatus}
            steps={loadingSteps}
            activeStepIndex={loadingStepIndex}
          />
        ) : (
          <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
            <div className="mb-6 sm:mb-8">
              <h2 className="mb-1.5 text-xl font-bold tracking-tight text-foreground sm:text-[22px]">
                Run a scan
              </h2>
              <p className="max-w-lg text-2sm leading-relaxed text-foreground-muted">
                Paste a message or URL. The more context you provide, the better the result.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
              <div>
                <ScanTabs value={activeTab} onValueChange={handleTabChange} />

                  {activeTab === "message" ? (
                  <MessageScanForm
                    messageText={messageText}
                    messageSource={messageSource}
                    messageEvidence={messageEvidence}
                    loading={loading}
                    rateLimited={limited !== null}
                    onMessageTextChange={setMessageText}
                    onMessageSourceChange={setMessageSource}
                    onMessageEvidenceChange={setMessageEvidence}
                    onAttachmentChange={setMessageAttachment}
                    onSubmit={handleMessageSubmit}
                  />
                ) : (
                  <LinkScanForm
                    urlText={urlText}
                    urlSource={urlSource}
                    urlContext={urlContext}
                    urlEvidence={urlEvidence}
                    loading={loading}
                    rateLimited={limited !== null}
                    onUrlTextChange={setUrlText}
                    onUrlSourceChange={setUrlSource}
                    onUrlContextChange={setUrlContext}
                    onUrlEvidenceChange={setUrlEvidence}
                    onAttachmentChange={setUrlAttachment}
                    onSubmit={handleLinkSubmit}
                  />
                )}
              </div>

              <aside className="hidden lg:block">
                <div className="sticky top-24 rounded-xl border border-border-card bg-background-elevated p-5 shadow-[var(--shadow-elevation-mid)]">
                  <h3 className="mb-4 text-2xs font-semibold uppercase tracking-wider text-foreground-subtle">
                    Tips for better results
                  </h3>
                  <ul className="space-y-4">
                    {tips.map((tip) => (
                      <li key={tip.title} className="text-xs">
                        <p className="mb-0.5 font-medium text-foreground">
                          {tip.title}
                        </p>
                        <p className="leading-relaxed text-foreground-muted">
                          {tip.description}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>
            </div>
          </div>
        )}
      </main>
    </>
  )
}

export default function ScanPageWrapper() {
  return (
    <Suspense fallback={null}>
      <ScanPage />
    </Suspense>
  )
}

function sleep(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      resolve(result.split(",")[1] ?? "")
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function shorten(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return "..."
  return trimmed.length > 36 ? `${trimmed.slice(0, 33)}...` : trimmed
}
