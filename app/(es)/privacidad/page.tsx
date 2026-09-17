import type { Metadata } from "next";
import Legal from "@/components/Legal";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Política de Privacidad",
  robots: { index: false },
};

export default function Page() {
  const L = site.legal;
  return (
    <Legal title="Política de Privacidad">
      <p>
        De conformidad con el Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018
        de Protección de Datos Personales y garantía de los derechos digitales
        (LOPDGDD), se informa al usuario sobre el tratamiento de sus datos personales.
      </p>

      <h2>1. Responsable del tratamiento</h2>
      <ul>
        <li><strong>Responsable:</strong> {L.fullName}</li>
        <li><strong>NIF/DNI:</strong> {L.nif}</li>
        <li><strong>Domicilio:</strong> {L.address}</li>
        <li><strong>Email:</strong> {L.privacyEmail}</li>
      </ul>

      <h2>2. Reseñas de Google que se muestran en la web</h2>
      <p>
        En la sección de opiniones de esta web se publican reseñas reales dejadas por
        clientes en mi Perfil de Negocio de Google, con su nombre público y el texto que
        escribieron, tal como aparecen en Google — <strong>sin filtrar por puntuación ni
        editar su contenido</strong>.
      </p>
      <ul>
        <li>
          <strong>Origen:</strong> son datos que el propio reseñador hizo públicos al
          escribir su reseña en Google. Aquí no se recogen ni se solicitan directamente.
        </li>
        <li>
          <strong>Datos publicados:</strong> nombre público del perfil de Google y el texto
          de la reseña. No se muestra su fotografía de perfil ni ningún dato de contacto.
        </li>
        <li>
          <strong>Base legal:</strong> interés legítimo (art. 6.1.f RGPD), al tratarse de
          una opinión ya pública sobre el propio servicio profesional que se presta, sin
          que ello suponga un perjuicio desproporcionado para el interesado frente al
          interés de mostrar valoraciones reales y verificables.
        </li>
        <li>
          <strong>Retirar una reseña:</strong> cualquier persona que haya dejado una reseña
          puede solicitar retirarla de esta web escribiendo a{" "}
          <a href={`mailto:${L.privacyEmail}`}>{L.privacyEmail}</a>. Se atiende en un
          plazo máximo de 30 días, con independencia de que la reseña se mantenga en
          Google.
        </li>
      </ul>

      <h2>3. ¿Qué otros datos recogemos y con qué finalidad?</h2>
      <p>
        A través del formulario de contacto recogemos los datos que el usuario nos
        facilita voluntariamente: nombre, email, teléfono, fecha y tipo de evento y el
        mensaje. La finalidad es <strong>atender la solicitud de información o
        presupuesto</strong> y mantener el contacto derivado de la misma.
      </p>

      <h2>4. Legitimación</h2>
      <p>
        La base legal del tratamiento de los datos del formulario es el{" "}
        <strong>consentimiento del interesado</strong>, otorgado al marcar la casilla de
        aceptación y enviar el formulario (art. 6.1.a RGPD). Para las reseñas de Google,
        la base es el interés legítimo descrito en el apartado 2.
      </p>

      <h2>5. Conservación de los datos</h2>
      <p>
        Los datos del formulario se conservarán durante el tiempo necesario para atender
        la solicitud y, posteriormente, durante los plazos legalmente exigibles. Si la
        consulta no deriva en una contratación, se eliminarán una vez atendida y, en todo
        caso, en un plazo máximo de 12 meses desde el último contacto. Las reseñas de
        Google se conservan mientras sigan publicadas en Google, salvo solicitud de
        retirada.
      </p>

      <h2>6. Destinatarios</h2>
      <p>
        No se cederán datos a terceros salvo obligación legal. Los datos pueden ser
        tratados por proveedores tecnológicos que prestan servicios al responsable
        (alojamiento web y gestión del formulario), actuando como encargados del
        tratamiento bajo las debidas garantías. Si el formulario se procesa a través de
        Formspree Inc. (EE. UU.), la transferencia internacional está amparada por el
        EU-US Data Privacy Framework y/o Cláusulas Contractuales Tipo.
      </p>

      <h2>7. Derechos del usuario</h2>
      <p>
        El usuario puede ejercer sus derechos de acceso, rectificación, supresión,
        oposición, limitación del tratamiento y portabilidad dirigiéndose a{" "}
        <a href={`mailto:${L.privacyEmail}`}>{L.privacyEmail}</a>, indicando el derecho
        que desea ejercer. Asimismo, tiene derecho a presentar una reclamación ante la
        Agencia Española de Protección de Datos (<a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">www.aepd.es</a>).
      </p>

      <h2>8. Veracidad de los datos</h2>
      <p>
        El usuario garantiza que los datos aportados son verdaderos y se responsabiliza
        de comunicar cualquier modificación de los mismos.
      </p>
    </Legal>
  );
}
