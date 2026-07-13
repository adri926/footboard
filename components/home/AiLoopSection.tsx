const STEPS = [
  { n: "1", icon: "🎥", title: "Filme ton match", desc: "Avec ton téléphone, depuis la tribune. Pas de caméra robot ni de budget pro." },
  { n: "2", icon: "◬", title: "L'IA débriefe", desc: "Timeline des moments clés, résumé du match — et tu poses tes questions à l'IA." },
  { n: "3", icon: "▶", title: "Concept + séance", desc: "L'IA repère les axes de progrès, te montre le concept et génère la séance à travailler." },
]

// La boucle IA — le différenciateur, mis en section-phare (filme → débriefe → progresse).
export default function AiLoopSection() {
  return (
    <div className="mb-24">
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--sauge)", display: "inline-block" }} />
        <span style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: 9, fontWeight: 700, letterSpacing: "0.14em",
          color: "var(--sauge)", background: "var(--sauge-dim)",
          border: "1px solid var(--sauge-border)",
          padding: "2px 8px", borderRadius: 100,
        }}>LE POINT FORT · ANALYSE VIDÉO IA</span>
      </div>
      <h2 style={{
        fontFamily: "var(--font-display), system-ui, sans-serif",
        fontWeight: 900, fontSize: "clamp(28px, 4vw, 44px)",
        lineHeight: 0.95, color: "rgba(255,255,255,0.95)",
        textAlign: "center", marginBottom: 12,
      }}>
        FILME. DÉBRIEFE.<br />
        <span style={{ color: "var(--sauge)" }}>PROGRESSE.</span>
      </h2>
      <p style={{
        fontFamily: "var(--font-body), sans-serif", fontWeight: 400, fontSize: 15,
        lineHeight: 1.6, color: "rgba(255,255,255,0.4)", textAlign: "center",
        maxWidth: 460, margin: "0 auto 40px",
      }}>
        La boucle qui fait progresser ton équipe — de la vidéo du match à la séance d&apos;entraînement, en 3 étapes.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {STEPS.map(({ n, icon, title, desc }) => (
          <div key={n} className="flex flex-col gap-3 p-6 rounded-2xl" style={{
            backgroundColor: "var(--bg-card)", border: "1px solid var(--sauge-border)",
          }}>
            <div className="flex items-center gap-3">
              <span style={{
                width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--font-mono), monospace", fontSize: 13, fontWeight: 700,
                color: "var(--sauge)", backgroundColor: "var(--sauge-dim)",
                border: "1px solid var(--sauge-border)",
              }}>{n}</span>
              <span style={{ fontSize: 20, color: "var(--sauge)" }}>{icon}</span>
            </div>
            <p style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontWeight: 900, fontSize: 18, color: "rgba(255,255,255,0.9)",
            }}>{title}</p>
            <p style={{
              fontFamily: "var(--font-body), sans-serif", fontWeight: 400,
              fontSize: 13, lineHeight: 1.55, color: "rgba(255,255,255,0.4)",
            }}>{desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
