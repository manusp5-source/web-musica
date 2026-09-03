import type { Metadata } from "next";
import "../globals.css";
import { site } from "@/config/site";
import { serif, sans } from "@/config/fonts";

export const metadata: Metadata = {
  metadataBase: new URL(site.domain),
  title: {
    default: `${site.brand} — Live music for events`,
    template: `%s · ${site.artistName}`,
  },
  description:
    "Live piano and viola for weddings, corporate events and celebrations across Spain.",
  keywords: [
    "live music weddings Spain",
    "wedding pianist Spain",
    "viola player events",
    "live piano and viola",
    "ceremony music",
    site.city,
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: site.brand,
    title: `${site.brand} — Live music for events`,
    description: "Live piano and viola for weddings and events in Spain.",
  },
  alternates: {
    canonical: "/en",
    languages: { es: "/", en: "/en" },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}