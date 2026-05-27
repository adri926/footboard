import type { Metadata } from "next";
import { Barlow_Condensed, Space_Mono, Barlow } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Nav from "@/components/Nav";
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
  title: "Footboard",
  description: "Crée et analyse des tactiques football",
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
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
