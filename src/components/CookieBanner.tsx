"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { site } from "@/config/site";
import type { Dict } from "@/i18n/dictionaries";

const KEY = "cookie-consent";

export default function CookieBanner({ dict }: { dict: Dict }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Sólo se muestra si hay cookies analíticas Y el usuario no ha decidido aún.
    if (site.cookies.analyticsEnabled && !localStorage.getItem(KEY)) {
      setShow(true);
    }
  }, []);

  function decide(value: "accepted" | "rejected") {
    localStorage.setItem(KEY, value);
    setShow(false);
    // TODO: si value === "accepted", inicializa aquí tu analytics.
  }

  if (!show) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-carbon/10 bg-marfil/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 py-4 text-sm text-carbon/80 sm:flex-row sm:justify-between">
        <p className="max-w-xl">
          {dict.cookieBanner.text}{" "}
          <Link href={dict.legal.paths.cookies} className="text-bronce underline">
            {dict.legal.cookies}
          </Link>
        </p>
        <div className="flex shrink-0 gap-3">
          <button onClick={() => decide("rejected")} className="btn-outline !px-5 !py-2 text-xs">
            {dict.cookieBanner.reject}
          </button>
          <button onClick={() => decide("accepted")} className="btn-gold !px-5 !py-2 text-xs">
            {dict.cookieBanner.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
