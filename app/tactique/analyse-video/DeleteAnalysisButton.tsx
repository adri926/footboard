"use client"

import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { deleteAnalysis } from "./actions"

export default function DeleteAnalysisButton({ id }: { id: string }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function handleDelete(e: React.MouseEvent) {
    e.preventDefault()
    if (!confirm("Supprimer cette analyse ?")) return
    startTransition(async () => {
      await deleteAnalysis(id)
      router.refresh()
    })
  }

  return (
    <button
      onClick={handleDelete}
      disabled={pending}
      style={{
        fontFamily: "var(--font-mono), monospace",
        fontSize: 8, letterSpacing: "0.06em",
        padding: "4px 10px", borderRadius: 6, cursor: "pointer",
        backgroundColor: "transparent",
        border: "1px solid rgba(224,112,112,0.2)",
        color: "rgba(224,112,112,0.5)",
        flexShrink: 0,
      }}
    >
      ✕
    </button>
  )
}
