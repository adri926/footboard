import { SignIn } from "@clerk/nextjs"

export default function SignInPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6"
      style={{ background: "linear-gradient(150deg,#06060e 0%,#060e06 100%)" }}>

      <div className="text-center mb-2">
        <h1 className="text-3xl font-black text-white">Footboard</h1>
        <p className="text-gray-400 mt-1 text-sm">Connecte-toi pour accéder à la plateforme</p>
      </div>

      <SignIn
        routing="hash"
        appearance={{
          variables: {
            colorBackground: "#1a1a2e",
            colorText: "#ffffff",
            colorPrimary: "#ffffff",
            colorTextSecondary: "#aaaaaa",
            colorInputBackground: "#2a2a3e",
            colorInputText: "#ffffff",
            borderRadius: "14px",
          },
          elements: {
            card: {
              boxShadow: "0 0 60px rgba(0,0,0,0.6)",
              border: "1px solid rgba(255,255,255,0.12)",
              width: "360px",
            },
            headerTitle: { color: "#ffffff", fontWeight: "700" },
            headerSubtitle: { color: "#aaaaaa" },
            socialButtonsBlockButton: {
              border: "1px solid rgba(255,255,255,0.2)",
              backgroundColor: "rgba(255,255,255,0.06)",
              color: "#ffffff",
              fontWeight: "600",
              padding: "12px",
            },
            socialButtonsBlockButtonText: { color: "#ffffff", fontWeight: "600" },
            dividerText: { color: "#666" },
            dividerLine: { backgroundColor: "rgba(255,255,255,0.1)" },
            formFieldLabel: { color: "#cccccc" },
            formFieldInput: {
              backgroundColor: "#2a2a3e",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "#ffffff",
            },
            formButtonPrimary: {
              backgroundColor: "#ffffff",
              color: "#000000",
              fontWeight: "700",
            },
            footerActionText: { color: "#888888" },
            footerActionLink: { color: "#ffffff", fontWeight: "600" },
            footer: { display: "none" },
          }
        }}
      />

      <p className="text-xs text-gray-600 text-center max-w-xs">
        En te connectant, tu accèdes à l'ensemble de la plateforme : Digiboard, données, Mon Club.
      </p>
    </main>
  )
}
