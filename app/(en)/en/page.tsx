import type { Metadata } from "next";
import HomePage from "@/components/HomePage";

export const metadata: Metadata = {
  title: "Live viola for wedding ceremonies in Granada",
  description:
    "Solo viola for the ceremony, your song arranged by me, PA included. Manuel, a violist born and raised in Granada.",
  alternates: { canonical: "/en", languages: { es: "/", en: "/en" } },
};

export default function Page() {
  return <HomePage locale="en" />;
}
