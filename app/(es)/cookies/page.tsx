import type { Metadata } from "next";
import Legal from "@/components/Legal";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Política de Cookies",
  robots: { index: false },
};

export default function Page() {
  const analytics = site.cookies.analyticsEnabled;
  return (
    <Legal title="Política de Cookies">
      <h2>1. ¿Qué son las cookies?</h2>
      <p>
        Las cookies son pequeños archivos de texto que los sitios web almacenan en el
        dispositivo del usuario para recordar información sobre su visita.
      </p>

      <h2>2. Cookies utilizadas en este sitio</h2>
      {analytics ? (
        <>
          <p>Este sitio utiliza las siguientes categorías de cookies:</p>
          <ul>
            <li>
              <strong>Cookies técnicas (necesarias):</strong> imprescindibles para el
              funcionamiento del sitio. No requieren consentimiento.
            </li>
            <li>
              <strong>Cookies analíticas:</strong> nos permiten medir y analizar la
              navegación de los usuarios de forma agregada para mejorar el sitio. Se
              activan únicamente con tu consentimiento.
            </li>
          </ul>
          <p>
            Puedes aceptar o rechazar las cookies analíticas a través del banner que
            aparece al acceder al sitio, y modificar tu elección en cualquier momento
            borrando las cookies desde la configuración de tu navegador.
          </p>
        </>
      ) : (
        <>
          <p>
            Actualmente este sitio <strong>no utiliza cookies de seguimiento ni
            publicitarias</strong>. Únicamente pueden emplearse cookies técnicas
            estrictamente necesarias para el correcto funcionamiento de la página, que
            están exentas del deber de consentimiento conforme al artículo 22.2 de la
            LSSI-CE.
          </p>
          <p>
            Si en el futuro se incorporan cookies analíticas o de terceros, esta política
            se actualizará y se solicitará el consentimiento previo del usuario mediante
            un banner.
          </p>
        </>
      )}

      <h2>3. Gestión de cookies</h2>
      <p>
        El usuario puede configurar o deshabilitar las cookies desde las opciones de su
        navegador (Chrome, Firefox, Safari, Edge). Consulta la ayuda de tu navegador
        para más información.
      </p>

      <h2>4. Contacto</h2>
      <p>
        Para cualquier duda sobre esta política, puedes escribir a{" "}
        <a href={`mailto:${site.legal.privacyEmail}`}>{site.legal.privacyEmail}</a>.
      </p>
    </Legal>
  );
}
