"use client"

import { useEffect, useState } from "react"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export default function InstallPrompt() {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setPromptEvent(e as BeforeInstallPromptEvent)
    }
    const installed = () => setPromptEvent(null)

    window.addEventListener("beforeinstallprompt", handler)
    window.addEventListener("appinstalled", installed)
    return () => {
      window.removeEventListener("beforeinstallprompt", handler)
      window.removeEventListener("appinstalled", installed)
    }
  }, [])

  if (!promptEvent) return null

  async function handleInstall() {
    if (!promptEvent) return
    await promptEvent.prompt()
    const { outcome } = await promptEvent.userChoice
    if (outcome === "accepted") setPromptEvent(null)
  }

  return (
    <button
      onClick={handleInstall}
      style={{
        fontFamily: "var(--font-mono), monospace",
        fontSize: 8, fontWeight: 700, letterSpacing: "0.08em",
        padding: "6px 12px", borderRadius: 8, cursor: "pointer",
        backgroundColor: "rgba(122,154,130,0.12)",
        border: "1px solid rgba(122,154,130,0.35)",
        color: "#7A9A82",
        whiteSpace: "nowrap",
      }}
    >
      ↓ INSTALLER
    </button>
  )
}
