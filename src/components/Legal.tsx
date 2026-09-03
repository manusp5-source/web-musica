import Link from "next/link";
import { site } from "@/config/site";

export default function Legal({
  title,
  children,
  homeHref = "/",
  updatedLabel = "Última actualización",
}: {
  title: string;
  children: React.ReactNode;
  homeHref?: string;
  updatedLabel?: string;
}) {
  return (
    <main className="bg-marfil">
      <div className="mx-auto max-w-3xl px-6 py-20 md:py-28">
        <Link href={homeHref} className="text-sm text-bronce hover:underline">
          ← {site.artistName}
        </Link>
        <h1 className="mt-6 font-serif text-4xl text-carbon md:text-5xl">{title}</h1>
        <p className="mt-2 text-sm text-carbon/70">
          {updatedLabel}: {site.legal.lastUpdated}
        </p>
        <div className="legal-prose mt-8">{children}</div>
      </div>
    </main>
  );
}
