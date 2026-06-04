"use client"

import { createContext, useCallback, useContext, useState, type ReactNode } from "react"
import type { ScanMode, ScanResponse } from "@/lib/wave-scan-view"

const STORAGE_KEY = "wave-scan-history"
const MAX_HISTORY = 20

export type SavedScan = {
  id: string
  result: ScanResponse
  mode: ScanMode
  timestamp: number
}

type ScanStore = {
  result: ScanResponse | null
  mode: ScanMode
  resultId: string | null
  setResult: (result: ScanResponse, mode: ScanMode) => string
  clearResult: () => void
  loadById: (id: string) => SavedScan | null
  history: SavedScan[]
}

const ScanContext = createContext<ScanStore | null>(null)

function generateId(): string {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

function loadHistory(): SavedScan[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as SavedScan[]) : []
  } catch {
    return []
  }
}

function saveToHistory(entry: SavedScan) {
  const history = loadHistory()
  history.unshift(entry)
  if (history.length > MAX_HISTORY) history.length = MAX_HISTORY
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
}

export function ScanStoreProvider({ children }: { children: ReactNode }) {
  const [result, setResultState] = useState<ScanResponse | null>(null)
  const [mode, setMode] = useState<ScanMode>("message")
  const [resultId, setResultId] = useState<string | null>(null)

  const setResult = useCallback((r: ScanResponse, m: ScanMode) => {
    const id = generateId()
    setResultState(r)
    setMode(m)
    setResultId(id)
    saveToHistory({ id, result: r, mode: m, timestamp: Date.now() })
    return id
  }, [])

  const clearResult = useCallback(() => {
    setResultState(null)
    setMode("message")
    setResultId(null)
  }, [])

  const loadById = useCallback((id: string) => {
    const history = loadHistory()
    return history.find((entry) => entry.id === id) ?? null
  }, [])

  return (
    <ScanContext.Provider value={{ result, mode, resultId, setResult, clearResult, loadById, history: loadHistory() }}>
      {children}
    </ScanContext.Provider>
  )
}

export function useScanStore() {
  const ctx = useContext(ScanContext)
  if (!ctx) throw new Error("useScanStore must be used within ScanStoreProvider")
  return ctx
}
