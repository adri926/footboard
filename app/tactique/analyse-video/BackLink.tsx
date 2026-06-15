"use client"

import { useRouter } from "next/navigation"

export default function BackLink({ fallback, children }: { fallback: string; children: React.ReactNode }) {
  const router = useRouter()

  return (
    <button
      onClick={() => {
        if (window.history.length > 1) router.back()
        else router.push(fallback)
      }}
      style={{
        fontFamily: "var(--font-mono), monospace",
        fontSize: 10, letterSpacing: "0.08em",
        color: "var(--text-faint)",
        background: "none", border: "none", cursor: "pointer", padding: 0,
        display: "inline-block", marginBottom: 32,
      }}
    >
      {children}
    </button>
  )
}
