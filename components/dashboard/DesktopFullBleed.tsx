"use client"

import { useEffect } from "react"

// Sur desktop, l'app s'affiche en colonne mobile centrée (voir Sidebar/MobileHeader). Certaines
// pages ont besoin de toute la largeur (analyse vidéo, digiboard : voir la vidéo / dessiner sur
// grand écran). Ce composant pose une classe `full-bleed` sur <html> le temps de la page ; le CSS
// desktop neutralise alors la contrainte de colonne. Sans effet sur mobile.
export default function DesktopFullBleed() {
  useEffect(() => {
    const el = document.documentElement
    el.classList.add("full-bleed")
    return () => el.classList.remove("full-bleed")
  }, [])
  return null
}
