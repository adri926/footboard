import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Space_Mono, Barlow } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import "./globals.css";

const barlowCondensed = Barlow_Condensed({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  style: ["normal", "italic"],
});

const spaceMono = Space_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const barlow = Barlow({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "Footboard — La plateforme des coachs de football",
    template: "%s — Footboard",
  },
  description: "Gérez votre club, préparez vos matchs et analysez vos vidéos avec l'IA. L'outil tout-en-un pour les coachs de football amateurs.",
  keywords: ["football", "coach", "tactique", "gestion club", "convocations", "entraînement", "amateur", "analyse vidéo IA"],
  authors: [{ name: "Footboard" }],
  creator: "Footboard",
  metadataBase: new URL("https://footboard.fr"),
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Footboard",
    title: "Footboard — La plateforme des coachs de football",
    description: "Gérez votre club, préparez vos matchs et analysez vos vidéos avec l'IA. L'outil tout-en-un pour les coachs de football amateurs.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Footboard — La plateforme des coachs de football",
    description: "Gérez votre club, préparez vos matchs et analysez vos vidéos avec l'IA.",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  appleWebApp: {
    capable: true,
    title: "Footboard",
    statusBarStyle: "black-translucent",
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#181812",
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="fr"
        className={`${barlowCondensed.variable} ${spaceMono.variable} ${barlow.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col" style={{ background: "#181812" }}>
          <Nav />
          <div className="flex-1">{children}</div>
          <Footer />
          <CookieBanner />
          <GoogleAnalytics />
          <ServiceWorkerRegister />
        </body>
      </html>
    </ClerkProvider>
  );
}
