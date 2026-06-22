export interface DashboardNavItem {
  href: string
  label: string
  icon: string
  badge?: string
}

export interface DashboardNavGroup {
  label: string
  // Libellé court pour le tab du bandeau bas (sinon `label`), icône du tab (sinon
  // icon du items[0]), et destination du 1er tap (sinon items[0].href) — voir
  // components/dashboard/Sidebar.tsx, le bandeau bas dérive ces 5 tabs directement
  // de ces groupes pour rester la source unique de vérité avec le menu complet.
  shortLabel?: string
  icon?: string
  primaryHref?: string
  items: DashboardNavItem[]
}

export const DASHBOARD_NAV_GROUPS: DashboardNavGroup[] = [
  {
    label: "Vue d'ensemble",
    shortLabel: "Accueil",
    items: [
      { href: "/dashboard", label: "Tableau de bord", icon: "◈" },
    ],
  },
  {
    label: "Club",
    items: [
      { href: "/dashboard/club/equipe",      label: "Équipe & accès", icon: "◎" },
      { href: "/dashboard/club/cotisations", label: "Cotisations",   icon: "€" },
      { href: "/dashboard/abonnement",       label: "Abonnement",    icon: "★" },
    ],
  },
  {
    label: "Activité",
    items: [
      { href: "/dashboard/calendrier",    label: "Calendrier",    icon: "▦" },
      { href: "/dashboard/matchs",        label: "Matchs",        icon: "◷" },
      { href: "/dashboard/entrainements", label: "Entraînements", icon: "◈" },
    ],
  },
  {
    label: "Effectif",
    items: [
      { href: "/dashboard/effectif",         label: "Effectif",     icon: "◻" },
      { href: "/dashboard/effectif/equipes", label: "Équipes",      icon: "◐" },
      { href: "/dashboard/data",             label: "Data & stats", icon: "▤" },
    ],
  },
  {
    label: "Tactique",
    shortLabel: "Tactique",
    icon: "⬡",
    primaryHref: "/tactique/analyse-video",
    items: [
      { href: "/tactique/digiboard",      label: "Digiboard",     icon: "⬡" },
      { href: "/tactique/concepts",       label: "Concepts",      icon: "▶" },
      { href: "/tactique/analyse-video",  label: "Analyse vidéo", icon: "◬", badge: "IA" },
    ],
  },
]

export function getDashboardNavGroups(canManageFees: boolean): DashboardNavGroup[] {
  return DASHBOARD_NAV_GROUPS.map(group => ({
    ...group,
    items: group.items.filter(item => item.href !== "/dashboard/club/cotisations" || canManageFees),
  }))
}
