"use client";

import { useState } from "react";
import Link from "next/link";
import { site } from "@/config/site";
import type { Dict } from "@/i18n/dictionaries";
import { IconWhatsApp, IconMail, IconPin } from "./icons";

type Status = "idle" | "submitting" | "sent" | "mailto" | "error";

export default function Contact({ dict }: { dict: Dict }) {
  const c = dict.contact;
  const [status, setStatus] = useState<Status>("idle");

  const whatsappHref = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(c.prefill)}`;
  const today = new Date().toISOString().split("T")[0];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot anti-spam: si un bot rellena el campo oculto, fingimos éxito.
    if (data.get("_gotcha")) {
      setStatus("sent");
      return;
    }

    // Con Formspree configurado → envío AJAX. Sin él → fallback mailto.
    if (site.formspreeId) {
      setStatus("submitting");
      try {
        const res = await fetch(`https://formspree.io/f/${site.formspreeId}`, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: data,
        });
        if (res.ok) {
          setStatus("sent");
          form.reset();
        } else {
          setStatus("error");
        }
      } catch {
        setStatus("error");
      }
    } else {
      // Evidencia de consentimiento (art. 7.1 RGPD): se incluye en el propio email.
      const body = [
        `${c.name}: ${data.get("name")}`,
        `${c.emailField}: ${data.get("email")}`,
        `${c.phone}: ${data.get("phone")}`,
        `${c.date}: ${data.get("date")}`,
        `${c.type}: ${data.get("type")}`,
        `${c.message}: ${data.get("message")}`,
        `${dict.legal.consentEmail} — ${new Date().toISOString()}`,
      ].join("\n");
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(
        "Consulta de evento — " + (data.get("name") || "")
      )}&body=${encodeURIComponent(body)}`;
      // El mailto no confirma envío: mostramos pista con alternativa visible.
      setStatus("mailto");
    }
  }

  const field =
    "w-full rounded-lg border border-carbon/15 bg-white/70 px-4 py-3 text-carbon outline-none transition-colors focus:border-dorado focus:ring-1 focus:ring-dorado";

  return (
    <section id="contacto" className="bg-carbon text-marfil">
      <div className="section grid gap-12 lg:grid-cols-2">
        <div>
          <p className="eyebrow !text-dorado">{c.eyebrow}</p>
          <h2 className="h-section !text-marfil">{c.title}</h2>
          <p className="mt-4 max-w-md text-marfil/75">{c.intro}</p>

          <div className="mt-8 space-y-4 text-marfil/80">
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-dorado">
              <IconWhatsApp className="h-5 w-5 text-dorado" />
              {site.whatsappDisplay}
            </a>
            <a href={`mailto:${site.email}`} className="flex items-center gap-3 hover:text-dorado">
              <IconMail className="h-5 w-5 text-dorado" />
              {site.email}
            </a>
            <div className="flex items-center gap-3">
              <IconPin className="h-5 w-5 text-dorado" />
              {site.city} · {site.serviceArea}
            </div>
          </div>

          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn mt-8 bg-[#25D366] text-white hover:opacity-90">
            <IconWhatsApp className="mr-2 h-5 w-5" />
            {c.whatsapp}
          </a>
        </div>

        <div className="rounded-2xl bg-marfil p-6 text-carbon md:p-8">
          {status === "sent" ? (
            <div className="flex h-full min-h-[20rem] flex-col items-center justify-center text-center">
              <div className="font-serif text-3xl text-carbon">{c.sent}</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Honeypot: invisible para humanos, los bots lo rellenan */}
              <input
                type="text"
                name="_gotcha"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute left-[-9999px] h-0 w-0 opacity-0"
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="cf-name" className="sr-only">{c.name}</label>
                  <input id="cf-name" name="name" required placeholder={c.name} className={field} />
                </div>
                <div>
                  <label htmlFor="cf-email" className="sr-only">{c.emailField}</label>
                  <input id="cf-email" name="email" type="email" required placeholder={c.emailField} className={field} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="cf-phone" className="sr-only">{c.phone}</label>
                  <input id="cf-phone" name="phone" placeholder={c.phone} className={field} />
                </div>
                <div>
                  <label htmlFor="cf-date" className="sr-only">{c.date}</label>
                  <input id="cf-date" name="date" type="date" min={today} aria-label={c.date} className={field} />
                </div>
              </div>
              <div>
                <label htmlFor="cf-type" className="sr-only">{c.type}</label>
                <select id="cf-type" name="type" defaultValue="" required className={field}>
                  <option value="" disabled>
                    {c.type}
                  </option>
                  {c.typeOptions.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="cf-message" className="sr-only">{c.message}</label>
                <textarea id="cf-message" name="message" rows={4} placeholder={c.message} className={field} />
              </div>
              <label className="flex items-start gap-2 text-xs text-carbon/70">
                <input type="checkbox" name="consent" required className="mt-0.5 accent-dorado" />
                <span>
                  {dict.legal.consent}{" "}
                  <Link href={dict.legal.paths.privacy} className="text-bronce underline">
                    {dict.legal.consentLink}
                  </Link>
                  .
                </span>
              </label>

              {status === "error" && (
                <p role="alert" className="rounded-lg bg-burdeos/10 px-4 py-3 text-sm text-burdeos">
                  {c.error}
                </p>
              )}
              {status === "mailto" && (
                <p role="status" className="rounded-lg bg-oliva/10 px-4 py-3 text-sm text-carbon/80">
                  {c.mailtoHint}
                </p>
              )}

              <button type="submit" disabled={status === "submitting"} className="btn-primary w-full disabled:opacity-60">
                {status === "submitting" ? "..." : c.submit}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
