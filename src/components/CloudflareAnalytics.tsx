import { site } from "@/config/site";

/**
 * Cloudflare Web Analytics — sin cookies, sin banner de consentimiento (a diferencia de
 * Google Analytics u otro que sí los use, ver site.cookies.analyticsEnabled). Sin token,
 * no renderiza nada: cero cambio de comportamiento hasta que Manuel dé de alta el sitio
 * en el dashboard de Cloudflare y pegue el token en site.analytics.cloudflareToken.
 *
 * Host permitido en next.config.mjs (script-src + connect-src) siempre, se use o no.
 */
export default function CloudflareAnalytics() {
  const token = site.analytics.cloudflareToken;
  if (!token) return null;

  return (
    <script
      defer
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon={JSON.stringify({ token })}
    />
  );
}
