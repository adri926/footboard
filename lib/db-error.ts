// Ne jamais renvoyer un message d'erreur Supabase brut au client (fuite de structure BD).
// On logue le détail côté serveur et on renvoie un message générique.
export function dbError(err: unknown): { ok: false; error: string } {
  console.error("[db]", err)
  return { ok: false, error: "Une erreur est survenue. Réessaie." }
}
