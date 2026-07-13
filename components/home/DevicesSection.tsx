const DEVICES = [
  {
    icon: "📱",
    title: "Sur le terrain",
    desc: "Installe l'app sur ton téléphone ou ta tablette en un tap (ajout à l'écran d'accueil). Convocations, compos, digiboard, vidéo — tout depuis ta poche, au bord du terrain.",
    tag: "MOBILE · TABLETTE",
  },
  {
    icon: "💻",
    title: "Au bureau",
    desc: "Prépare ta semaine tranquillement : connecte-toi depuis n'importe quel navigateur. C'est la même app, rien à installer.",
    tag: "WEB · AUCUNE INSTALLATION",
  },
]

// Footboard = app web (PWA) : terrain sur mobile/tablette, préparation au bureau via le navigateur.
export default function DevicesSection() {
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
        }}>PARTOUT OÙ TU ES</span>
      </div>
      <h2 style={{
        fontFamily: "var(--font-display), system-ui, sans-serif",
        fontWeight: 900, fontSize: "clamp(28px, 4vw, 44px)",
        lineHeight: 0.95, color: "rgba(255,255,255,0.95)",
        textAlign: "center", marginBottom: 40,
      }}>
        SUR LE TERRAIN<br />
        <span style={{ color: "var(--sauge)" }}>OU AU BUREAU.</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DEVICES.map(({ icon, title, desc, tag }) => (
          <div key={title} className="flex flex-col gap-4 p-6 rounded-2xl" style={{
            backgroundColor: "var(--bg-card)", border: "1px solid var(--sauge-border)",
          }}>
            <span style={{ fontSize: 30 }}>{icon}</span>
            <div>
              <p style={{
                fontFamily: "var(--font-display), system-ui, sans-serif",
                fontWeight: 900, fontSize: 20, color: "rgba(255,255,255,0.92)", marginBottom: 8,
              }}>{title}</p>
              <p style={{
                fontFamily: "var(--font-body), sans-serif", fontWeight: 400,
                fontSize: 14, lineHeight: 1.6, color: "rgba(255,255,255,0.42)",
              }}>{desc}</p>
            </div>
            <span style={{
              fontFamily: "var(--font-mono), monospace", fontSize: 9, fontWeight: 700,
              letterSpacing: "0.1em", color: "var(--sauge)", marginTop: "auto",
            }}>{tag}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
