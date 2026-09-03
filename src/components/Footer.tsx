import Link from "next/link";
import { site } from "@/config/site";
import type { Dict } from "@/i18n/dictionaries";
import { IconInstagram, IconYouTube, IconSpotify } from "./icons";

export default function Footer({ dict }: { dict: Dict }) {
  const year = new Date().getFullYear();
  const socials = [
    { url: site.social.instagram, Icon: IconInstagram, label: "Instagram" },
    { url: site.social.youtube, Icon: IconYouTube, label: "YouTube" },
    { url: site.social.spotify, Icon: IconSpotify, label: "Spotify" },
  ].filter((s) => s.url);

  return (
    <footer className="bg-carbon text-marfil/80">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-12 text-center">
        <div className="font-serif text-2xl text-marfil">{site.brand}</div>
        <p className="text-sm">{dict.footer.built}</p>
        {socials.length > 0 && (
          <div className="flex gap-5">
            {socials.map(({ url, Icon, label }) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-marfil/70 transition-colors hover:text-dorado"
              >
                <Icon className="h-6 w-6" />
              </a>
            ))}
          </div>
        )}
        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-marfil/60">
          <Link href={dict.legal.paths.notice} className="hover:text-dorado">{dict.legal.notice}</Link>
          <span className="text-marfil/20">·</span>
          <Link href={dict.legal.paths.privacy} className="hover:text-dorado">{dict.legal.privacy}</Link>
          <span className="text-marfil/20">·</span>
          <Link href={dict.legal.paths.cookies} className="hover:text-dorado">{dict.legal.cookies}</Link>
        </nav>

        <div className="text-xs text-marfil/50">
          © {year} {site.artistName}. {dict.footer.rights}
        </div>
      </div>
    </footer>
  );
}
