"use client"

import { useState, type FormEvent } from "react"

import { LinkScanForm } from "@/components/wave-scanner/link-scan-form"
import { LandingScreen } from "@/components/wave-scanner/landing-screen"
import { MessageScanForm } from "@/components/wave-scanner/message-scan-form"
import { ScanLoadingTerminal } from "@/components/wave-scanner/scan-loading-terminal"
import { ScanResultPanel } from "@/components/wave-scanner/scan-result-panel"
import { ScanTabs } from "@/components/wave-scanner/scan-tabs"
import { ScannerNav } from "@/components/wave-scanner/scanner-nav"
import type { LoadingStep } from "@/components/wave-scanner/scan-loading-terminal"
import type { ScanMode, ScanResponse } from "@/lib/wave-scan-view"

const loadingSteps: LoadingStep[] = [
  { label: "Parsing input structure..." },
  { label: "Checking language and tone...", tone: "blue" },
  { label: "Running pattern analysis...", tone: "yellow" },
  { label: "Identifying red flags..." },
  { label: "Scoring risk level...", tone: "blue" },
  { label: "Generating recommendation...", tone: "green" },
]

const loadingProgress = [10, 25, 38, 52, 67, 80, 95]

type ScreenState = "landing" | "scanner" | "loading" | "result"

export function ScannerPage() {
  const [screen, setScreen] = useState<ScreenState>("landing")
  const [activeTab, setActiveTab] = useState<ScanMode>("message")
  const [scanMode, setScanMode] = useState<ScanMode>("message")
  const [messageText, setMessageText] = useState("")
  const [messageSource, setMessageSource] = useState("")
  const [messageEvidence, setMessageEvidence] = useState("")
  const [urlText, setUrlText] = useState("")
  const [urlSource, setUrlSource] = useState("")
  const [urlContext, setUrlContext] = useState("")
  const [urlEvidence, setUrlEvidence] = useState("")
  const [result, setResult] = useState<ScanResponse | null>(null)
  const [loadingProgressValue, setLoadingProgressValue] = useState(0)
  const [loadingStepIndex, setLoadingStepIndex] = useState(0)
  const [loadingStatus, setLoadingStatus] = useState(
    "Running analysis - this takes a few seconds",
  )
  const [loadingCommand, setLoadingCommand] = useState('wave scan "..."')

  const loading = screen === "loading"

  async function fetchScan(payload: {
    input_text: string
    source?: string
    url?: string
    context?: string
    evidence?: string
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
    },
    mode: ScanMode,
    commandLabel: string,
  ) {
    setScanMode(mode)
    setResult(null)
    setLoadingProgressValue(0)
    setLoadingStepIndex(0)
    setLoadingStatus("Running analysis - this takes a few seconds")
    setLoadingCommand(commandLabel)
    setScreen("loading")

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
    await minDelay

    window.clearInterval(timer)
    setLoadingStepIndex(loadingSteps.length - 1)
    setLoadingProgressValue(100)
    setLoadingStatus("Analysis complete - loading result")

    await sleep(250)
    setResult(response)
    setScreen("result")
  }

  async function handleMessageSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await runScan(
      {
        input_text: messageText,
        source: messageSource || undefined,
        evidence: messageEvidence || undefined,
      },
      "message",
      `wave scan "${shorten(messageText)}" --mode message`,
    )
  }

  async function handleLinkSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await runScan(
      {
        input_text: "Analyze this URL for scam or fraud risk.",
        source: urlSource || undefined,
        url: urlText,
        context: urlContext || undefined,
        evidence: urlEvidence || undefined,
      },
      "link",
      `wave scan "${shorten(urlText)}" --mode url`,
    )
  }

  function openScanner(mode: ScanMode) {
    setActiveTab(mode)
    setScreen("scanner")
  }

  function startNewScan() {
    setScreen("scanner")
  }

  function goHome() {
    setScreen("landing")
  }

  return (
    <main className="min-h-screen text-foreground [background:var(--gradient-page)]">
      <ScannerNav
        showBack={screen !== "landing" && screen !== "loading"}
        onBack={goHome}
        onStart={() => openScanner("message")}
      />

      {screen === "landing" ? (
        <LandingScreen
          onCheckMessage={() => openScanner("message")}
          onCheckUrl={() => openScanner("link")}
        />
      ) : null}

      {screen === "scanner" ? (
        <div
          style={{
            maxWidth: 620,
            margin: "0 auto",
            padding: "32px 16px",
          }}
        >
          <div style={{ marginBottom: 24 }}>
            <h2
              style={{
                fontSize: 22,
                fontWeight: 500,
                letterSpacing: "-0.02em",
                color: "var(--foreground)",
                marginBottom: 4,
              }}
            >
              Run a scan
            </h2>
            <p
              style={{
                fontSize: 13,
                color: "var(--foreground-muted)",
                lineHeight: 1.6,
              }}
            >
              Paste a message or URL. The more context you provide, the better the result.
            </p>
          </div>

          <div
            style={{
              background: "var(--primary-dim)",
              border: "0.5px solid var(--border-subtle)",
              borderRadius: 14,
              padding: "20px 24px",
            }}
          >
            <ScanTabs value={activeTab} onValueChange={setActiveTab} />

            {activeTab === "message" ? (
              <MessageScanForm
                messageText={messageText}
                messageSource={messageSource}
                messageEvidence={messageEvidence}
                loading={loading}
                onMessageTextChange={setMessageText}
                onMessageSourceChange={setMessageSource}
                onMessageEvidenceChange={setMessageEvidence}
                onExampleSelect={setMessageText}
                onSubmit={handleMessageSubmit}
              />
            ) : (
              <LinkScanForm
                urlText={urlText}
                urlSource={urlSource}
                urlContext={urlContext}
                urlEvidence={urlEvidence}
                loading={loading}
                onUrlTextChange={setUrlText}
                onUrlSourceChange={setUrlSource}
                onUrlContextChange={setUrlContext}
                onUrlEvidenceChange={setUrlEvidence}
                onExampleSelect={setUrlText}
                onSubmit={handleLinkSubmit}
              />
            )}
          </div>
        </div>
      ) : null}

      {screen === "loading" ? (
        <ScanLoadingTerminal
          commandLabel={loadingCommand}
          progress={loadingProgressValue}
          status={loadingStatus}
          steps={loadingSteps}
          activeStepIndex={loadingStepIndex}
        />
      ) : null}

      {screen === "result" ? (
        <ScanResultPanel
          result={result}
          mode={scanMode}
          onNewScan={startNewScan}
          onBackHome={goHome}
        />
      ) : null}
    </main>
  )
}

function sleep(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

function shorten(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return "..."
  return trimmed.length > 36 ? `${trimmed.slice(0, 33)}...` : trimmed
}