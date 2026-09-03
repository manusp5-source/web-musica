# Página web música — Piano & Viola

Web profesional para promocionar a un músico (piano y viola) para eventos en España.
Construida con **Next.js 15 + Tailwind CSS**. ES por defecto + versión en inglés (`/en`).

## 🚀 Arranque rápido

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # build de producción
```

## ✏️ Personalizar (lo que tú editas)

Toda tu información está centralizada en **2 archivos**:

| Archivo | Qué contiene |
|---------|--------------|
| `src/config/site.ts` | Nombre, ciudad, email, WhatsApp, redes, dominio, embeds de vídeo |
| `src/i18n/dictionaries.ts` | TODOS los textos de la web (ES + EN) |

Busca los comentarios `←CAMBIAR` en `src/config/site.ts`.

## 🎨 Diseño

- Paleta: marfil `#FAF7F2`, carbón `#1C1B19`, dorado champán `#C9A86A`, burdeos `#5E2A33`
- Tipografía: Cormorant Garamond (títulos) + Inter (texto)
- Colores y fuentes en `tailwind.config.ts` y `app/globals.css`

## 🖼️ Material pendiente (placeholders activos)

| Dónde | Cómo sustituir |
|-------|----------------|
| Foto hero | `src/components/Hero.tsx` (ver comentario `SWAP FOTO/VÍDEO`) |
| Retrato "Sobre mí" | `src/components/Sections.tsx` → `About` |
| Vídeos | `src/config/site.ts` → `media.youtubeIds` |
| Fechas de eventos | `src/components/Sections.tsx` → `Events` (array `events`) |

## 📬 Formulario de contacto

Funciona sin configurar (abre el email del visitante vía `mailto`).
Para recibir los envíos en tu bandeja sin que se abra su email:
1. Crea un formulario gratis en [formspree.io](https://formspree.io)
2. Pega el ID en `src/config/site.ts` → `formspreeId`

## ☁️ Deploy

Recomendado: **Cloudflare Pages** (gratis y permite uso comercial).

> ⚠️ El plan gratuito de Vercel (Hobby) **prohíbe uso comercial** — una web para
> conseguir bolos lo es. Si prefieres Vercel, necesitas el plan Pro (~$20/mes).

```bash
# Cloudflare Pages (desde el dashboard: conecta el repo git, framework "Next.js")
# o con CLI:
npx wrangler pages deploy
```

> ⚠️ **Antes de publicar**: rellena `site.legal` (nombre, NIF, dirección) en
> `src/config/site.ts`. Publicar con placeholders incumple la LSSI/RGPD.
> Verifica con: `npm run check-legal`

## 🔎 SEO incluido

- Metadatos + Open Graph
- `sitemap.xml` y `robots.txt` automáticos
- JSON-LD (MusicGroup + LocalBusiness) para Google
- hreflang ES/EN
