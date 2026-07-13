// Icônes au trait du bandeau bas — monochrome, stroke: currentColor pour hériter de la
// couleur active/inactive gérée par le parent (voir Sidebar BOTTOM_TABS).

export type TabIconName = "actu" | "effectif" | "ia" | "terrain" | "digiboard"

const PATHS: Record<TabIconName, React.ReactNode> = {
  // Maison (Actu / aujourd'hui)
  actu: (
    <>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V20h14V9.5" />
    </>
  ),
  // Deux silhouettes (Effectif)
  effectif: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
      <path d="M16 5.5a3 3 0 0 1 0 5.5" />
      <path d="M20.5 19a5.5 5.5 0 0 0-4-5.3" />
    </>
  ),
  // Étincelle (IA)
  ia: (
    <path d="M12 3l1.7 5.1a2 2 0 0 0 1.2 1.2L20 11l-5.1 1.7a2 2 0 0 0-1.2 1.2L12 19l-1.7-5.1a2 2 0 0 0-1.2-1.2L4 11l5.1-1.7a2 2 0 0 0 1.2-1.2z" />
  ),
  // Terrain vu de dessus (Terrain = matchs + entraînements)
  terrain: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="1.5" />
      <path d="M12 4v16" />
      <circle cx="12" cy="12" r="2.5" />
    </>
  ),
  // Tableau tactique avec une flèche de jeu (Digiboard)
  digiboard: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="1.5" />
      <path d="M7 15l4-4 3 2 3.5-4.5" />
    </>
  ),
}

export default function TabIcon({ name, size = 18 }: { name: TabIconName; size?: number }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  )
}
