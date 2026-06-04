"use client"

import { Suspense, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { ScanResultPanel } from "@/components/wave-scanner/scan-result-panel"
import { ScannerNav } from "@/components/wave-scanner/scanner-nav"
import { useScanStore } from "@/lib/scan-store"

function ScanResultContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get("id")
  const { result, mode, setResult, loadById, clearResult } = useScanStore()
  const hydrated = useRef(false)

  useEffect(() => {
    if (hydrated.current) return

    if (id) {
      const saved = loadById(id)
      if (saved) {
        setResult(saved.result, saved.mode)
      }
    }

    hydrated.current = true
  }, [id, loadById, setResult])

  useEffect(() => {
    if (hydrated.current && !result && !id) {
      router.replace("/scan")
    }
  }, [result, id, router])

  if (!result) return null

  return (
    <>
      <ScannerNav />
      <main className="min-h-screen text-foreground bg-background animate-page-enter">
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

export default function ScanResultPage() {
  return (
    <Suspense fallback={null}>
      <ScanResultContent />
    </Suspense>
  )
}
