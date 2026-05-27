"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { deleteSituation } from "@/app/tactique/situations/actions"

export default function DeleteButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleDelete() {
    startTransition(async () => {
      await deleteSituation(id)
      router.refresh()
    })
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      style={{
        fontFamily: "var(--font-mono), monospace",
        fontSize: 9, fontWeight: 700, letterSpacing: "0.08em",
        border: "1px solid rgba(255,255,255,0.08)",
        color: "rgba(255,255,255,0.2)",
        padding: "7px 10px", borderRadius: 8,
        backgroundColor: "transparent",
        cursor: isPending ? "wait" : "pointer",
        transition: "all 0.2s",
      }}
    >
      {isPending ? "..." : "✕"}
    </button>
  )
}
