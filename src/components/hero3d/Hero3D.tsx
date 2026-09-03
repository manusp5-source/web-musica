"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { site } from "@/config/site";

// El canvas WebGL NUNCA se renderiza en servidor (mejor LCP/SEO): ssr:false.
const Scene = dynamic(() => import("./Scene"), { ssr: false });

export default function Hero3D({ label }: { label: string }) {
  const [enabled, setEnabled] = useState(false);
  const [paused, setPaused] = useState(false);
  const [playing, setPlaying] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);

  const hasAudio = Boolean(site.media.heroAudio);

  // Guardas: desactiva en móvil, pantallas pequeñas o "reduce motion".
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.matchMedia("(max-width: 768px)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const lowMem =
      typeof (navigator as Navigator & { deviceMemory?: number }).deviceMemory ===
        "number" &&
      (navigator as Navigator & { deviceMemory?: number }).deviceMemory! <= 4;
    if (reduce || small || (coarse && lowMem)) setEnabled(false);
    else setEnabled(true);
  }, []);

  // Pausa el render cuando el hero no está a la vista (ahorra batería/CPU).
  useEffect(() => {
    if (!enabled || !containerRef.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => setPaused(!entry.isIntersecting),
      { threshold: 0.05 }
    );
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, [enabled]);

  // Libera el AudioContext al desmontar (los navegadores limitan los contextos vivos).
  useEffect(() => {
    return () => {
      ctxRef.current?.close().catch(() => {});
      ctxRef.current = null;
      analyserRef.current = null;
    };
  }, []);

  async function togglePlay() {
    const el = audioRef.current;
    if (!el) return;
    // El grafo de audio se crea con el primer gesto del usuario (política autoplay).
    if (!ctxRef.current) {
      const AC =
        window.AudioContext ||
        (window as Window & { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AC) return;
      const ctx = new AC();
      const src = ctx.createMediaElementSource(el);
      const an = ctx.createAnalyser();
      an.fftSize = 64;
      an.smoothingTimeConstant = 0.8;
      src.connect(an);
      an.connect(ctx.destination);
      ctxRef.current = ctx;
      analyserRef.current = an;
    }
    if (ctxRef.current.state === "suspended") await ctxRef.current.resume();
    if (el.paused) {
      await el.play();
      setPlaying(true);
    } else {
      el.pause();
      setPlaying(false);
    }
  }

  if (!enabled) return null;

  return (
    <>
      <div ref={containerRef} className="absolute inset-0 z-0" aria-hidden>
        <Scene analyserRef={analyserRef} paused={paused} />
      </div>

      {hasAudio && (
        <>
          {/* Sin crossOrigin: el audio es same-origin (/public). Añádelo solo si
              lo sirves desde otra CDN con cabeceras CORS correctas. */}
          <audio ref={audioRef} src={site.media.heroAudio} loop preload="none" />
          <button
            onClick={togglePlay}
            aria-label={label}
            className="absolute bottom-24 right-6 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-dorado/50 bg-carbon/40 text-dorado backdrop-blur transition-transform hover:scale-110"
          >
            {playing ? (
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor" className="ml-0.5 h-5 w-5">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        </>
      )}
    </>
  );
}
