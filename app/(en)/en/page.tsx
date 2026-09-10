import type { Metadata } from "next";
import HomePage from "@/components/HomePage";

export const metadata: Metadata = {
  title: "Live viola for wedding ceremonies in Granada",
  description:
    "Solo viola for the ceremony, your song arranged by me, PA included. Published prices from €390. Granada and province.",
  alternates: { canonical: "/en", languages: { es: "/", en: "/en" } },
};

export default function Page() {
  return <HomePage locale="en" />;
}
