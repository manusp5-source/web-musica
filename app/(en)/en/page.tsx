import type { Metadata } from "next";
import HomePage from "@/components/HomePage";

export const metadata: Metadata = {
  title: "Live piano & viola for events in Spain",
  description:
    "Live piano and viola for weddings, corporate events and celebrations across Spain.",
  alternates: { canonical: "/en", languages: { es: "/", en: "/en" } },
};

export default function Page() {
  return <HomePage locale="en" />;
}
