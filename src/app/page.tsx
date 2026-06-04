"use client"

import { useRouter } from "next/navigation"
import { ScannerNav } from "@/components/wave-scanner/scanner-nav"
import { LandingScreen } from "@/components/wave-scanner/landing-screen"

export default function Home() {
  const router = useRouter()

  return (
    <>
      <ScannerNav />
      <main className="min-h-screen text-foreground [background:var(--gradient-page)]">
        <LandingScreen
          onCheckMessage={() => router.push("/scan?mode=message")}
          onCheckUrl={() => router.push("/scan?mode=link")}
        />
      </main>
    </>
  )
}
