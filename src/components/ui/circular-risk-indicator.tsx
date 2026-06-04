"use client"

import { useEffect, useState } from "react"
import { getRiskColor } from "@/lib/wave-scan-view"

interface CircularRiskIndicatorProps {
  score: number
  riskLevel: string
  size?: number
  animated?: boolean
}

export function CircularRiskIndicator({
  score,
  riskLevel,
  size = 80,
  animated = true,
}: CircularRiskIndicatorProps) {
  const [displayScore, setDisplayScore] = useState(animated ? 0 : score)
  const [progress, setProgress] = useState(animated ? 0 : score)

  useEffect(() => {
    if (!animated) return

    let frame: number
    const start = performance.now()
    const duration = 900

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      const current = Math.round(eased * score)
      setDisplayScore(current)
      setProgress(eased * score)
      if (t < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [score, animated])

  const radius = (size - 6) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progress / 100) * circumference
  const color = getRiskColor(riskLevel)

  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg
        width={size}
        height={size}
        style={{ transform: "rotate(-90deg)" }}
        aria-hidden="true"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border-subtle)"
          strokeWidth={2}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: animated ? "none" : undefined }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 0,
        }}
      >
        <span
          style={{
            fontSize: size * 0.3,
            fontWeight: 500,
            lineHeight: 1,
            letterSpacing: "-0.03em",
            color,
          }}
        >
          {displayScore}
        </span>
      </div>
    </div>
  )
}