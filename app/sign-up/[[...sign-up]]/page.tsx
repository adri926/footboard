import { SignUp } from "@clerk/nextjs"

export default function SignUpPage() {
  return (
    <main className="min-h-[calc(100vh-56px)] flex items-center justify-center">
      <SignUp
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
    </main>
  )
}
