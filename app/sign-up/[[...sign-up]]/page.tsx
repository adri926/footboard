import { SignUp } from "@clerk/nextjs"

export default function SignUpPage() {
  return (
    <main className="min-h-[calc(100vh-56px)] flex items-center justify-center">
      <SignUp
        appearance={{
          variables: {
            colorBackground: "#0a0a14",
            colorText: "white",
            colorPrimary: "#ffffff",
            colorInputBackground: "rgba(255,255,255,0.06)",
            colorInputText: "white",
          },
          elements: {
            card: "border border-white/10 shadow-2xl",
            formButtonPrimary: "bg-white text-black hover:bg-white/90",
          }
        }}
      />
    </main>
  )
}
