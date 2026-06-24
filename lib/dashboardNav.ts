export interface DashboardNavItem {
  href: string
  label: string
  icon: string
  badge?: string
}

export interface DashboardNavGroup {
  label: string
  items: DashboardNavItem[]
}

export const DASHBOARD_NAV_GROUPS: DashboardNavGroup[] = [
  {
    label: "Vue d'ensemble",
    items: [
      { href: "/dashboard", label: "Tableau de bord", icon: "◈" },
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
    items: [
      { href: "/tactique/digiboard",      label: "Digiboard",     icon: "⬡" },
      { href: "/tactique/concepts",       label: "Concepts",      icon: "▶" },
      { href: "/tactique/analyse-video",  label: "Analyse vidéo", icon: "◬", badge: "IA" },
    ],
  },
]

export function getDashboardNavGroups(): DashboardNavGroup[] {
  return DASHBOARD_NAV_GROUPS
}
