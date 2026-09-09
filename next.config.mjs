/** @type {import('next').NextConfig} */

// Cabeceras de seguridad (OWASP A05). Ajusta CSP si añades nuevos orígenes
// (analytics, otra CDN de media, etc.).
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      // Hosts concretos, nunca `https:` a secas: el esquema suelto acepta cualquier
      // origen. Los dos que hay son las miniaturas de YouTube y coinciden con
      // images.remotePatterns. Si algún día se muestran las fotos de los reseñadores,
      // aquí entra lh3.googleusercontent.com — explícito, no por comodín. (EV-011)
      "img-src 'self' https://i.ytimg.com https://img.youtube.com data:",
      "font-src 'self'",
      "media-src 'self'",
      "connect-src 'self' https://formspree.io",
      "frame-src https://www.youtube.com https://www.youtube-nocookie.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self' https://formspree.io",
    ].join("; "),
  },
];

const nextConfig = {
  reactStrictMode: true,
  images: {
    // SOLO hosts concretos — un comodín "**" convierte /_next/image en proxy abierto (SSRF).
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "img.youtube.com" },
    ],
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
