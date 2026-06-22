"use client"

import { useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { uploadVideo } from "./actions"

export default function UploadForm() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const router = useRouter()

  const MAX_SIZE_MB = 500

  function handleSubmit(formData: FormData) {
    setError(null)
    const file = formData.get("video")
    if (file instanceof File && file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`Vidéo trop lourde — max ${MAX_SIZE_MB} Mo.`)
      return
    }
    startTransition(async () => {
      const res = await uploadVideo(formData)
      if (!res.ok) {
        setError(res.error)
        return
      }
      formRef.current?.reset()
      router.push(`/tactique/analyse-video/${res.id}`)
    })
  }

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid rgba(122,154,130,0.13)",
        borderRadius: 14,
        padding: "22px 24px",
        display: "flex", flexDirection: "column", gap: 12,
      }}
    >
      <p style={{
        fontFamily: "var(--font-mono), monospace",
        fontSize: 9, letterSpacing: "0.12em",
        color: "var(--sauge)",
      }}>
        NOUVELLE ANALYSE
      </p>

      <input
        name="title"
        type="text"
        placeholder="Titre (ex: AS Poincaré vs FC Rival)"
        style={{
          backgroundColor: "var(--bg-input)",
          border: "1px solid rgba(122,154,130,0.18)",
          borderRadius: 8, padding: "10px 12px",
          color: "var(--text-primary)",
          fontFamily: "var(--font-body), sans-serif", fontSize: 13,
        }}
      />

      <input
        name="video"
        type="file"
        accept="video/*"
        required
        style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: 11, color: "var(--text-muted)",
        }}
      />

      <p style={{
        fontFamily: "var(--font-body), sans-serif",
        fontSize: 11, color: "var(--text-faint)", lineHeight: 1.5,
      }}>
        L&apos;analyse génère une timeline d&apos;événements et permet de poser des questions sur
        le match pendant 1h après l&apos;upload.
      </p>

      {error && (
        <p style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: 10, color: "rgba(220,80,80,0.8)",
        }}>
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        style={{
          alignSelf: "flex-start",
          fontFamily: "var(--font-mono), monospace",
          fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
          color: "var(--sauge)",
          backgroundColor: "var(--sauge-dim)",
          border: "1px solid var(--sauge-border)",
          borderRadius: 8, padding: "10px 18px",
          cursor: isPending ? "default" : "pointer",
          opacity: isPending ? 0.6 : 1,
        }}
      >
        {isPending ? "UPLOAD EN COURS..." : "UPLOADER ET ANALYSER →"}
      </button>

      {isPending && (
        <div style={{
          marginTop: 4,
          fontFamily: "var(--font-body), sans-serif",
          fontSize: 12, color: "var(--text-faint)", lineHeight: 1.6,
        }}>
          <p>⏳ Upload de la vidéo vers le serveur…</p>
          <p style={{ marginTop: 4, opacity: 0.6 }}>
            Ne ferme pas cette page. L&apos;analyse IA démarrera automatiquement après l&apos;upload.
          </p>
        </div>
      )}
    </form>
  )
}
