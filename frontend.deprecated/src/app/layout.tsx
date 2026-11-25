import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from '@/contexts/LanguageContext'
import BackgroundMusic from '@/components/layout/BackgroundMusic'

const outfit = Outfit({
  variable: "--font-outfit-var",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta-var",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: 'RASED — Réseau Africain des Sciences de l\'Éducation',
    template: '%s',
  },
  description: "Le site officiel du RASED, réseau panafricain réunissant les institutions membres pour la recherche, la formation et la collaboration scientifique en sciences de l'éducation.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://rased.ucad.sn'),
  openGraph: {
    siteName: 'RASED',
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${outfit.variable} ${jakarta.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-ui-panel text-ui-text antialiased">
        <LanguageProvider>
          {children}
          <BackgroundMusic />
        </LanguageProvider>
      </body>
    </html>
  );
}
