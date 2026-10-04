import type { Metadata } from "next";
import "../globals.css";
import { site } from "@/config/site";
import { serif, sans } from "@/config/fonts";
import CloudflareAnalytics from "@/components/CloudflareAnalytics";

export const metadata: Metadata = {
  metadataBase: new URL(site.domain),
  title: {
    default: `Música en directo para ceremonias en ${site.city} — ${site.brand}`,
    template: `%s · ${site.artistName}`,
  },
  description:
    "Viola en directo para ceremonias de boda en " + site.city +
    ". Arreglo propio de vuestra canción y equipo de sonido incluido, con Manuel, violista granadino.",
  // "viola" apenas se busca (docs/mercado-viola-eventos.md §3.2): las palabras que
  // trae la gente son música, ceremonia, boda y la ciudad. La viola es el instrumento,
  // no el reclamo — pero tampoco se disfraza de violín, que sería mentir.
  keywords: [
    "música para bodas " + site.city,
    "música ceremonia boda",
    "música en directo boda iglesia",
    "cuerda en directo ceremonia",
    "violista bodas",
    site.city,
  ],
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: site.brand,
    title: `${site.brand} — Música para ceremonias en ${site.city}`,
    description:
      "La ceremonia a viola sola, con vuestro arreglo hecho a medida por un violista de Granada.",
  },
  alternates: {
    canonical: "/",
    languages: { es: "/", en: "/en" },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${serif.variable} ${sans.variable}`}>
      <body className="font-sans">
        {children}
        <CloudflareAnalytics />
      </body>
    </html>
  );
}