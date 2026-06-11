"use client"

import { SignUp } from "@clerk/nextjs"

interface Props {
  token: string
  email: string
  playerFirstName: string
  clubName: string
}

export default function InvitationSignUp({ token, email, playerFirstName, clubName }: Props) {
  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: 28,
      padding: 24, backgroundColor: "#181812",
    }}>
      <div style={{ textAlign: "center", maxWidth: 440 }}>
        <p style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: 9, fontWeight: 700, letterSpacing: "0.14em",
          color: "rgba(122,154,130,0.6)", textTransform: "uppercase", marginBottom: 8,
        }}>
          {clubName}
        </p>
        <h1 style={{
          fontFamily: "var(--font-display), system-ui, sans-serif",
          fontWeight: 900, fontSize: 24, color: "rgba(255,255,255,0.95)", marginBottom: 8,
        }}>
          {playerFirstName ? `Bienvenue ${playerFirstName}` : "Crée ton espace joueur"}
        </h1>
        <p style={{
          fontFamily: "var(--font-body), sans-serif", fontWeight: 400, fontSize: 13,
          lineHeight: 1.6, color: "rgba(255,255,255,0.35)",
        }}>
          Crée ton mot de passe pour accéder à ton calendrier, tes convocations et tes statistiques.
        </p>
      </div>

      <SignUp
        routing="hash"
        signInUrl="/sign-in"
        initialValues={{ emailAddress: email }}
        forceRedirectUrl={`/invitation/${token}/confirm`}
        appearance={{
          variables: {
            colorBackground: "#1a1a2e",
            colorText: "#ffffff",
            colorPrimary: "#ffffff",
            colorTextSecondary: "#cccccc",
            colorInputBackground: "#2a2a3e",
            colorInputText: "#ffffff",
            borderRadius: "12px",
          },
          elements: {
            card: { boxShadow: "0 0 40px rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.15)" },
            headerTitle: { color: "#ffffff", fontSize: "20px", fontWeight: "700" },
            headerSubtitle: { color: "#aaaaaa" },
            socialButtonsBlockButton: { border: "1px solid rgba(255,255,255,0.2)", color: "#ffffff", backgroundColor: "rgba(255,255,255,0.08)" },
            socialButtonsBlockButtonText: { color: "#ffffff", fontWeight: "600" },
            formFieldLabel: { color: "#cccccc" },
            formFieldInput: { backgroundColor: "#2a2a3e", border: "1px solid rgba(255,255,255,0.2)", color: "#ffffff" },
            formButtonPrimary: { backgroundColor: "#ffffff", color: "#000000", fontWeight: "700" },
            footerActionText: { color: "#aaaaaa" },
            footerActionLink: { color: "#ffffff", fontWeight: "600" },
            dividerText: { color: "#888888" },
            dividerLine: { backgroundColor: "rgba(255,255,255,0.15)" },
          }
        }}
      />
    </div>
  )
}
