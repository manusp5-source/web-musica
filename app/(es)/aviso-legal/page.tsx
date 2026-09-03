import type { Metadata } from "next";
import Legal from "@/components/Legal";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Aviso Legal",
  robots: { index: false },
};

export default function Page() {
  const L = site.legal;
  return (
    <Legal title="Aviso Legal">
      <h2>1. Datos identificativos</h2>
      <p>
        En cumplimiento del artículo 10 de la Ley 34/2002 de Servicios de la Sociedad
        de la Información y de Comercio Electrónico (LSSI-CE), se informa de los
        siguientes datos del titular de este sitio web:
      </p>
      <ul>
        <li><strong>Titular:</strong> {L.fullName}</li>
        <li><strong>NIF/DNI:</strong> {L.nif}</li>
        <li><strong>Domicilio:</strong> {L.address}</li>
        <li><strong>Email:</strong> {site.email}</li>
        <li><strong>Sitio web:</strong> {site.domain}</li>
      </ul>

      <h2>2. Objeto</h2>
      <p>
        Este sitio web tiene por finalidad ofrecer información sobre los servicios de
        música en vivo (piano y viola) para eventos prestados por el titular, así como
        facilitar el contacto para la solicitud de presupuestos.
      </p>

      <h2>3. Condiciones de uso</h2>
      <p>
        El acceso y uso de este sitio web atribuye la condición de usuario, que acepta
        las condiciones aquí reflejadas. El usuario se compromete a hacer un uso
        adecuado de los contenidos y a no emplearlos para actividades ilícitas.
      </p>

      <h2>4. Propiedad intelectual</h2>
      <p>
        Todos los contenidos de este sitio (textos, imágenes, grabaciones de audio y
        vídeo, diseño y código) son titularidad del titular del sitio o de terceros que
        han autorizado su uso, y están protegidos por la normativa de propiedad
        intelectual. Queda prohibida su reproducción sin autorización expresa.
      </p>

      <h2>5. Responsabilidad</h2>
      <p>
        El titular no se hace responsable de los daños derivados del uso indebido del
        sitio ni de la indisponibilidad temporal del mismo por causas técnicas.
      </p>

      <h2>6. Legislación aplicable</h2>
      <p>
        Las presentes condiciones se rigen por la legislación española. Para cualquier
        controversia, las partes se someten a los juzgados y tribunales del domicilio
        del titular.
      </p>
    </Legal>
  );
}
