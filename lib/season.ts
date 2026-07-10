// Saison de football en cours, calculée depuis la date — bascule à l'été (juillet).
// Évite les "2025/2026" codés en dur qui deviennent faux chaque année.
export function getCurrentSeason(d: Date = new Date()): string {
  const y = d.getFullYear()
  return d.getMonth() >= 6 ? `${y}/${y + 1}` : `${y - 1}/${y}`
}
