import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "HeyNoona | Exclusieve Photobooth voor Elk Event",
  description:
    "Boek een exclusieve photobooth voor jouw bruiloft, verjaardag, bedrijfsfeest of event. Kies jouw kleurpakket en maak herinneringen die blijven.",
  keywords: [
    "Photobooth huren",
    "Photobooth bruiloft",
    "Photobooth verjaardag",
    "Photobooth huren Nederland",
    "Exclusieve photobooth",
    "Luxe photobooth",
    "HeyNoona",
  ],
  openGraph: {
    title: "HeyNoona | Exclusieve Photobooth voor Elk Event",
    description:
      "Boek een exclusieve photobooth voor jouw bruiloft, verjaardag, bedrijfsfeest of event. Kies jouw kleurpakket en maak herinneringen die blijven.",
    type: "website",
    locale: "nl_NL",
    siteName: "HeyNoona",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className={`${inter.variable} ${cormorant.variable} scroll-smooth`}>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
