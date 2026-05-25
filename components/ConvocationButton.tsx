"use client"

import { useState, useTransition } from "react"

interface Props {
  onSend: () => Promise<{ sent: number; skipped: number; error?: string }>
  label?: string
}

export default function ConvocationButton({ onSend, label = "📧 Envoyer les convocations" }: Props) {
  const [pending, start] = useTransition()
  const [result, setResult] = useState<{ sent: number; skipped: number; error?: string } | null>(null)

  function handleClick() {
    if (!confirm("Envoyer un email de convocation à tous les joueurs concernés ?")) return
    start(async () => {
      const r = await onSend()
      setResult(r)
      setTimeout(() => setResult(null), 5000)
    })
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button onClick={handleClick} disabled={pending}
        className="px-4 py-2 rounded-xl text-sm font-bold transition disabled:opacity-50"
        style={{
          backgroundColor: result?.sent ? "#4ade80" : "rgba(96,165,250,0.15)",
          color: result?.sent ? "white" : "#60a5fa",
          border: result?.sent ? "1px solid #4ade80" : "1px solid rgba(96,165,250,0.4)",
        }}>
        {pending ? "Envoi en cours..." : result?.sent ? `✓ ${result.sent} convocation${result.sent>1?"s":""} envoyée${result.sent>1?"s":""}` : label}
      </button>
      {result?.error && (
        <p className="text-xs text-red-400">{result.error}</p>
      )}
      {result && result.skipped > 0 && !result.error && (
        <p className="text-xs text-gray-500">
          {result.skipped} joueur{result.skipped>1?"s":""} ignoré{result.skipped>1?"s":""} (email manquant)
        </p>
      )}
    </div>
  )
}
