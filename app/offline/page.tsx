"use client"

export default function OfflinePage() {
  return (
    <main style={{
      background: "var(--bg)", minHeight: "calc(100vh - 56px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24,
    }}>
      <div style={{ textAlign: "center", maxWidth: 360 }}>
        <p style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: 10, letterSpacing: "0.14em",
          color: "rgba(122,154,130,0.45)", marginBottom: 16,
        }}>
          FOOTBOARD · HORS LIGNE
        </p>
        <h1 style={{
          fontFamily: "var(--font-display), system-ui, sans-serif",
          fontWeight: 900, fontSize: 42, lineHeight: 1,
          letterSpacing: "-0.01em",
          color: "rgba(255,255,255,0.85)", marginBottom: 16,
        }}>
          PAS DE<br />CONNEXION
        </h1>
        <p style={{
          fontFamily: "var(--font-body), sans-serif",
          fontSize: 14, color: "rgba(255,255,255,0.35)", lineHeight: 1.6,
          marginBottom: 32,
        }}>
          Vérifie ta connexion internet et réessaie.<br />
          Les pages déjà visitées sont accessibles depuis l&apos;historique.
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
            padding: "11px 28px", borderRadius: 10, cursor: "pointer",
            backgroundColor: "rgba(122,154,130,0.12)",
            border: "1px solid rgba(122,154,130,0.30)",
            color: "#7A9A82",
          }}>
          RÉESSAYER
        </button>
      </div>
    </main>
  )
}
