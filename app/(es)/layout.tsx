import type { Metadata } from "next";
import "../globals.css";
import { site } from "@/config/site";
import { serif, sans } from "@/config/fonts";

export const metadata: Metadata = {
  metadataBase: new URL(site.domain),
  title: {
    default: `${site.brand} — Música en vivo para eventos`,
    template: `%s · ${site.artistName}`,
  },
  description:
    "Piano y viola en directo para bodas, eventos corporativos y celebraciones. Música en vivo a medida en " +
    site.city + " y toda España.",
  keywords: [
    "música en vivo bodas",
    "pianista bodas",
    "violista eventos",
    "piano y viola directo",
    "música ceremonia",
    site.city,
  ],
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: site.brand,
    title: `${site.brand} — Música en vivo para eventos`,
    description: "Piano y viola en directo para bodas y eventos en España.",
  },
  alternates: {
    canonical: "/",
    languages: { es: "/", en: "/en" },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${serif.variable} ${sans.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}