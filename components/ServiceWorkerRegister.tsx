"use client"

import { useEffect } from "react"

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return

    // En développement, le SW (cache-first sur les bundles JS) fige l'UI sur une vieille
    // version à chaque changement. On ne l'enregistre pas en dev, et on désinscrit tout SW
    // déjà actif + on purge ses caches pour repartir propre.
    if (process.env.NODE_ENV !== "production") {
      navigator.serviceWorker.getRegistrations().then(regs => regs.forEach(r => r.unregister()))
      if (window.caches) caches.keys().then(keys => keys.forEach(k => caches.delete(k)))
      return
    }

    navigator.serviceWorker.register("/sw.js")
  }, [])

  return null
}
