const FAQ = [
  {
    q: "Faut-il du matériel spécial pour filmer ?",
    a: "Non. Ton téléphone suffit — filme depuis la tribune, uploade la vidéo, l'IA fait le reste. Pas de caméra robot ni de budget pro.",
  },
  {
    q: "Est-ce que ça marche sur ordinateur ?",
    a: "Oui. Footboard est une app web : sur le terrain tu l'installes sur ton téléphone ou ta tablette, et au bureau tu te connectes depuis n'importe quel navigateur. C'est la même app, rien à installer sur l'ordi.",
  },
  {
    q: "Mes joueurs ont-ils besoin d'un compte ?",
    a: "Non, pas obligatoire. Tu gères tout côté coach. Tes joueurs peuvent recevoir les convocations par email, et créer un compte joueur seulement s'ils veulent suivre leurs stats.",
  },
  {
    q: "Puis-je essayer gratuitement ?",
    a: "Oui. Tu crées ton club et démarres gratuitement, sans carte bancaire. Tu passes à une offre payante seulement si tu veux débloquer l'analyse vidéo IA et la gestion complète.",
  },
  {
    q: "Puis-je annuler à tout moment ?",
    a: "Oui, sans engagement. Tu peux changer ou annuler ton abonnement quand tu veux.",
  },
]

export default function FaqSection() {
  return (
    <div className="mb-24" style={{ maxWidth: 760, marginLeft: "auto", marginRight: "auto" }}>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--sauge)", display: "inline-block" }} />
        <span style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: 9, fontWeight: 700, letterSpacing: "0.14em",
          color: "var(--sauge)", background: "var(--sauge-dim)",
          border: "1px solid var(--sauge-border)",
          padding: "2px 8px", borderRadius: 100,
        }}>QUESTIONS FRÉQUENTES</span>
      </div>
      <h2 style={{
        fontFamily: "var(--font-display), system-ui, sans-serif",
        fontWeight: 900, fontSize: "clamp(28px, 4vw, 44px)",
        lineHeight: 0.95, color: "rgba(255,255,255,0.95)",
        textAlign: "center", marginBottom: 40,
      }}>
        TOUT CE QUE<br />
        <span style={{ color: "var(--sauge)" }}>TU TE DEMANDES.</span>
      </h2>

      <div className="flex flex-col gap-3">
        {FAQ.map(({ q, a }) => (
          <details key={q} style={{
            backgroundColor: "var(--bg-card)", border: "1px solid rgba(122,154,130,0.13)",
            borderRadius: 12, padding: "16px 20px",
          }}>
            <summary style={{
              cursor: "pointer", listStyle: "none",
              fontFamily: "var(--font-body), sans-serif", fontWeight: 600, fontSize: 15,
              color: "rgba(255,255,255,0.88)",
            }}>
              {q}
            </summary>
            <p style={{
              fontFamily: "var(--font-body), sans-serif", fontWeight: 400,
              fontSize: 14, lineHeight: 1.65, color: "rgba(255,255,255,0.45)", marginTop: 12,
            }}>
              {a}
            </p>
          </details>
        ))}
      </div>
    </div>
  )
}
