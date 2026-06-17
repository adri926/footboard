import type { CapacitorConfig } from "@capacitor/cli"

const config: CapacitorConfig = {
  appId: "fr.footboard.app",
  appName: "Footboard",
  // Pointe vers la prod — pas de bundle local (Next.js SSR incompatible avec export statique)
  server: {
    url: "https://footboard-chi.vercel.app",
    cleartext: false,
  },
  ios: {
    contentInset: "automatic",
  },
  android: {
    allowMixedContent: false,
    backgroundColor: "#17160f",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 800,
      backgroundColor: "#17160f",
      showSpinner: false,
    },
  },
}

export default config
