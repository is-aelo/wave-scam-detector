"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { ScanResultPanel } from "@/components/wave-scanner/scan-result-panel"
import { ScannerNav } from "@/components/wave-scanner/scanner-nav"
import { useScanStore } from "@/lib/scan-store"

export default function ScanResultPage() {
  const router = useRouter()
  const { result, mode, clearResult } = useScanStore()

  useEffect(() => {
    if (!result) {
      router.replace("/scan")
    }
  }, [result, router])

  if (!result) return null

  return (
    <>
      <ScannerNav />
      <main className="min-h-screen text-foreground [background:var(--gradient-page)]">
        <ScanResultPanel
          result={result}
          mode={mode}
          onNewScan={() => router.push(`/scan?mode=${mode}`)}
          onBackHome={() => {
            clearResult()
            router.push("/")
          }}
        />
      </main>
    </>
  )
}
