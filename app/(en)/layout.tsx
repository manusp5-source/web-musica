import type { Metadata } from "next";
import "../globals.css";
import { site } from "@/config/site";
import { serif, sans } from "@/config/fonts";
import CloudflareAnalytics from "@/components/CloudflareAnalytics";

export const metadata: Metadata = {
  metadataBase: new URL(site.domain),
  title: {
    default: `${site.brand} — Live music for events`,
    template: `%s · ${site.artistName}`,
  },
  description:
    "Live viola for wedding ceremonies in Granada. Your song arranged by me, PA included, from €390.",
  keywords: [
    "wedding ceremony music Granada",
    "live music wedding Spain",
    "string player wedding ceremony",
    "viola player weddings",
    "church wedding music Granada",
    site.city,
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: site.brand,
    title: `${site.brand} — Ceremony music in ${site.city}`,
    description:
      "The ceremony on solo viola, your song arranged by me. Published prices from €390.",
  },
  alternates: {
    canonical: "/en",
    languages: { es: "/", en: "/en" },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body className="font-sans">
        {children}
        <CloudflareAnalytics />
      </body>
    </html>
  );
}