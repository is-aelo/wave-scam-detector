"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { ScanMode, ScanResponse } from "@/lib/wave-scan-view"

type ScanStore = {
  result: ScanResponse | null
  mode: ScanMode
  setResult: (result: ScanResponse, mode: ScanMode) => void
  clearResult: () => void
}

const ScanContext = createContext<ScanStore | null>(null)

export function ScanStoreProvider({ children }: { children: ReactNode }) {
  const [result, setResultState] = useState<ScanResponse | null>(null)
  const [mode, setMode] = useState<ScanMode>("message")

  const setResult = (r: ScanResponse, m: ScanMode) => {
    setResultState(r)
    setMode(m)
  }

  const clearResult = () => {
    setResultState(null)
    setMode("message")
  }

  return (
    <ScanContext.Provider value={{ result, mode, setResult, clearResult }}>
      {children}
    </ScanContext.Provider>
  )
}

export function useScanStore() {
  const ctx = useContext(ScanContext)
  if (!ctx) throw new Error("useScanStore must be used within ScanStoreProvider")
  return ctx
}
