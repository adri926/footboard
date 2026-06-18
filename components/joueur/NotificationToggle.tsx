"use client"

import { useEffect, useState } from "react"
import { subscribePush, unsubscribePush } from "@/app/joueur/actions"

const SECTION: React.CSSProperties = {
  padding: "20px 22px", borderRadius: 12,
  backgroundColor: "var(--bg-card)",
  border: "1px solid rgba(122,154,130,0.08)",
  marginBottom: 24,
  display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
  flexWrap: "wrap",
}

const BUTTON: React.CSSProperties = {
  fontFamily: "var(--font-mono), monospace", fontSize: 10, fontWeight: 700,
  letterSpacing: "0.08em", textTransform: "uppercase",
  padding: "10px 18px", borderRadius: 8, border: "1px solid rgba(122,154,130,0.4)",
  backgroundColor: "rgba(122,154,130,0.1)", color: "#7A9A82",
  cursor: "pointer",
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")
  const rawData = atob(base64)
  return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)))
}

type Status = "loading" | "unsupported" | "denied" | "subscribed" | "unsubscribed"

export default function NotificationToggle() {
  const [status, setStatus] = useState<Status>("loading")

  useEffect(() => {
    Promise.resolve().then(async () => {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        setStatus("unsupported")
        return
      }
      if (Notification.permission === "denied") {
        setStatus("denied")
        return
      }
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.getSubscription()
      if (sub) { setStatus("subscribed"); return }

      // Pas encore abonné — activation automatique
      // Fonctionne sur Android/Chrome/Firefox ; iOS nécessite un geste → fallback bouton
      try {
        const permission = await Notification.requestPermission()
        if (permission !== "granted") {
          setStatus(permission === "denied" ? "denied" : "unsubscribed")
          return
        }
        const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
        if (!publicKey) { setStatus("unsubscribed"); return }
        const newSub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey),
        })
        const json = newSub.toJSON()
        if (json.endpoint && json.keys) {
          await subscribePush({ endpoint: json.endpoint, keys: { p256dh: json.keys.p256dh!, auth: json.keys.auth! } })
        }
        setStatus("subscribed")
      } catch {
        setStatus("unsubscribed")
      }
    }).catch(() => setStatus("unsupported"))
  }, [])

  async function enable() {
    const permission = await Notification.requestPermission()
    if (permission !== "granted") {
      setStatus("denied")
      return
    }

    const reg = await navigator.serviceWorker.ready
    const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
    if (!publicKey) return

    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    })

    const json = sub.toJSON()
    if (!json.endpoint || !json.keys) return

    await subscribePush({
      endpoint: json.endpoint,
      keys: { p256dh: json.keys.p256dh!, auth: json.keys.auth! },
    })
    setStatus("subscribed")
  }

  async function disable() {
    const reg = await navigator.serviceWorker.ready
    const sub = await reg.pushManager.getSubscription()
    if (sub) {
      await unsubscribePush(sub.endpoint)
      await sub.unsubscribe()
    }
    setStatus("unsubscribed")
  }

  if (status === "loading" || status === "unsupported") return null

  return (
    <div style={SECTION}>
      <div>
        <p style={{
          fontFamily: "var(--font-display), system-ui, sans-serif",
          fontWeight: 900, fontSize: 16, color: "rgba(255,255,255,0.92)", marginBottom: 4,
        }}>
          Notifications
        </p>
        <p style={{
          fontFamily: "var(--font-body), sans-serif", fontSize: 13,
          color: "rgba(255,255,255,0.5)",
        }}>
          {status === "denied"
            ? "Notifications bloquées — autorise-les dans les réglages de ton navigateur."
            : status === "subscribed"
              ? "Tu reçois une alerte quand le coach te convoque pour un match."
              : "Active les notifications pour être prévenu quand le coach te convoque."}
        </p>
      </div>
      {status === "unsubscribed" && (
        <button style={BUTTON} onClick={enable}>Activer</button>
      )}
      {status === "subscribed" && (
        <button style={BUTTON} onClick={disable}>Désactiver</button>
      )}
    </div>
  )
}
