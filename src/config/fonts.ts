import { Cormorant_Garamond, Inter } from "next/font/google";

// Fuentes compartidas por los dos root layouts (ES y EN).
export const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

export const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});