"use client";

import { site } from "@/config/site";
import { IconWhatsApp } from "./icons";

export default function WhatsAppButton({
  label,
  prefill,
}: {
  label: string;
  prefill: string;
}) {
  const href = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(prefill)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition-transform hover:scale-110"
    >
      <IconWhatsApp className="h-7 w-7" />
    </a>
  );
}