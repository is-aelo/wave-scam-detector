"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { DevContact } from "@/components/wave-scanner/dev-contact"
import { Button } from "@/components/ui/button"

export function ScannerNav() {
  const pathname = usePathname()
  const isHome = pathname === "/"

  return (
    <header className="sticky top-0 z-40 border-b border-border-subtle bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[52px] w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="/" className="flex items-center gap-3">
          <Image
            src="/safesurf.png"
            alt="Wave"
            width={28}
            height={28}
            className="size-7 rounded-md object-cover"
          />
          <div className="leading-tight">
            <p className="text-sm font-semibold">Wave</p>
          </div>
        </a>

        {isHome ? (
          <Button asChild size="sm">
            <Link href="/scan">Start Scanning</Link>
          </Button>
        ) : (
          <DevContact />
        )}
      </div>
    </header>
  )
}
