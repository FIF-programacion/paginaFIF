import { Link } from "react-router-dom";
import { LegalLayout } from "../../components/LegalLayout.jsx";
import { ORG } from "../../data/org.js";
import { PLATFORM_ENABLED } from "../../config.js";

export function PrivacyPage() {
  return (
    <LegalLayout title="Política de privacidad">
      <h2>1. Responsable</h2>
      <p>
        El responsable del tratamiento es {ORG.name}, {ORG.country}. {ORG.legalAddress}. {ORG.ruc}.{" "}
        {ORG.email}
      </p>
      <h2>2. Qué datos pedimos</h2>
      <p>
        <strong>Formulario de inscripción.</strong> Para inscribir a un estudiante pedimos al
        representante:
      </p>
      <ul>
        <li>Datos del representante: nombres y apellidos, cédula o pasaporte, parentesco, celular / WhatsApp y correo.</li>
        <li>Datos del estudiante: nombres y apellidos, cédula o documento de identidad, fecha de nacimiento, institución educativa (fiscal o particular), grado o curso, ciudad y sector de residencia.</li>
        <li>Información académica: participación en concursos, preparación previa y expectativas.</li>
        <li>Modalidad (presencial o virtual).</li>
        <li>Contacto de emergencia (nombre, parentesco y celular) y, de forma opcional, información indispensable para actuar ante una emergencia, que puede incluir datos de salud.</li>
        <li>Becas que se solicitan y datos para coordinar el pago de la inscripción: nombre, celular, correo y monto.</li>
      </ul>
      <p>
        <strong>Formulario de donación.</strong> Nombre, celular, correo, monto y notas que quieras
        agregar.
      </p>
      <p>
        Este sitio no procesa pagos ni pide datos de tarjetas o cuentas bancarias: el pago se
        coordina directamente con el equipo de la fundación.
      </p>
      <h2>3. Para qué los usamos</h2>
      <ul>
        <li>Gestionar la inscripción, asignar el grupo y el horario del estudiante, y comunicarnos con su representante.</li>
        <li>Coordinar el pago de la inscripción, las becas y las donaciones.</li>
        <li>Actuar ante una emergencia durante las actividades. La información de emergencia se usa solo cuando sea necesario para proteger el bienestar del estudiante.</li>
      </ul>
      <p>
        No usamos estos datos con fines publicitarios. Cualquier uso con fines investigativos
        requerirá una autorización específica.
      </p>
      <h2>4. Base legal (Ecuador)</h2>
      <p>
        Tratamos datos según la Ley Orgánica de Protección de Datos Personales (LOPDP) y el Código
        de la Niñez y Adolescencia. La base es el consentimiento expreso del representante legal del
        estudiante, que se otorga al enviar el formulario, y la gestión del servicio educativo
        solicitado. La información de salud que se comparta voluntariamente se trata como dato
        sensible.
      </p>
      <h2>5. Cómo se envían y dónde se guardan</h2>
      <p>
        Al enviar un formulario, el sitio prepara un mensaje y abre WhatsApp para que tú lo envíes
        al número institucional de la fundación ({ORG.phone}). El sitio no guarda esos datos en
        servidores propios ni en tu navegador. La información queda en las conversaciones y
        registros que maneja el equipo de coordinación de la fundación, con acceso limitado a las
        personas que gestionan inscripciones, pagos y donaciones.
      </p>
      <h2>6. Destinatarios y transferencias</h2>
      <p>
        No vendemos ni cedemos datos. WhatsApp (Meta) actúa como canal de envío y puede tratar
        datos fuera de Ecuador según sus propias condiciones. El sitio se aloja en Cloudflare, que
        puede registrar datos técnicos de conexión (como la dirección IP) por seguridad. No hay
        analítica de terceros ni redes publicitarias, y las tipografías se sirven desde este mismo
        sitio.
      </p>
      <h2>7. Conservación</h2>
      <p>
        Conservamos los datos mientras el estudiante participe en las actividades de la fundación y
        el tiempo adicional que exijan obligaciones legales o contables. Después se eliminan.
      </p>
      <h2>8. Tus derechos</h2>
      <p>
        Puedes solicitar acceso, rectificación, actualización, eliminación, oposición, portabilidad
        o suspensión del tratamiento de tus datos o de los del estudiante que representas,
        escribiendo a {ORG.email}. También puedes presentar un reclamo ante la Superintendencia de
        Protección de Datos Personales.
      </p>
      <h2>9. Plataforma FIF Learning</h2>
      <p>
        La plataforma de aprendizaje en línea aún no está habilitada. Antes de abrirla
        actualizaremos esta política con los datos de cuentas, progreso y tareas que necesite.
      </p>
      <p>
        <Link to="/legal/cookies">Política de cookies</Link> · <Link to="/legal/terminos">Términos</Link>
      </p>
    </LegalLayout>
  );
}

export function TermsPage() {
  return (
    <LegalLayout title="Términos y condiciones">
      <h2>1. Aceptación</h2>
      <p>
        Al usar este sitio, enviar un formulario o, cuando esté habilitada, crear una cuenta en FIF
        Learning, aceptas estos términos, la <Link to="/legal/privacidad">privacidad</Link> y la{" "}
        <Link to="/legal/cookies">política de cookies</Link>.
      </p>
      <h2>2. Qué es este servicio</h2>
      <p>
        Este sitio presenta a {ORG.name}, sus programas, inscripciones y donaciones. Las
        inscripciones y donaciones se coordinan con el equipo de la fundación; el sitio no procesa
        pagos.
      </p>
      <p>
        FIF Learning, cuando esté habilitada, será una plataforma de refuerzo académico y práctica
        gamificada. No es escuela presencial, no otorga títulos oficiales y no sustituye el
        currículo ministerial.
      </p>
      <h2>3. Cuentas</h2>
      <p>
        Hay cuentas de estudiante y de docente. Debes dar información veraz. La contraseña es
        personal. El personal docente solo debe crear pruebas propias de la fundación.
      </p>
      <h2>4. Conducta</h2>
      <p>
        No está permitido hostigar, subir contenido ilícito, suplantar identidades ni usar la
        plataforma para dañar a otras personas.
      </p>
      <h2>5. Contenidos y propiedad</h2>
      <p>
        El software, textos pedagógicos de FIF y las ilustraciones originales de personajes de la
        fundación pertenecen a {ORG.name} o se usan con autorización. No incluimos personajes de
        terceros con derechos reservados. Las menciones a obras de arte clásicas se usan solo como
        referencia educativa.
      </p>
      <h2>6. Certificados</h2>
      <p>
        El PDF de finalización reconoce que completaste un curso en esta plataforma. No es un
        título oficial.
      </p>
      <h2>7. Disponibilidad</h2>
      <p>
        El servicio se ofrece “tal como está” en esta versión de navegador. Puede haber errores o
        interrupciones.
      </p>
      <h2>8. Ley aplicable</h2>
      <p>Estos términos se rigen por las leyes de {ORG.jurisdiction}.</p>
    </LegalLayout>
  );
}

export function CookiesPage() {
  return (
    <LegalLayout title="Política de cookies y almacenamiento">
      <h2>¿Usamos cookies de seguimiento?</h2>
      <p>No. No hay Google Analytics, píxeles publicitarios ni redes sociales embebidas.</p>
      <h2>¿Hace falta un muro de consentimiento de marketing?</h2>
      <p>
        No, mientras solo exista almacenamiento estrictamente necesario. Si más adelante se añade
        analítica o publicidad, habrá que pedir consentimiento previo y granular.
      </p>
      <h2>Qué se guarda en tu dispositivo</h2>
      <ul>
        <li>El aviso “Entendido” de esta política, para no mostrarlo en cada visita.</li>
        {PLATFORM_ENABLED && (
          <>
            <li>Cuenta de FIF Learning (nombre, correo, resumen de contraseña, grupo).</li>
            <li>Progreso, puntos, racha, pruebas y calificaciones.</li>
          </>
        )}
      </ul>
      <p>
        Eso equivale a una cookie técnica. Los formularios de inscripción y donación no guardan
        datos en tu navegador. La LOPDP y las normas de cookies exigen informar; no exigir un
        “acepto todo” si no hay rastreo.
      </p>
      <h2>Cómo borrarlo</h2>
      <p>En tu navegador: datos del sitio o almacenamiento local para esta dirección.</p>
    </LegalLayout>
  );
}

export function RefundsPage() {
  return (
    <LegalLayout title="Política de reembolsos">
      <p>
        Este sitio no procesa pagos ni tiene pasarela: no cobra dentro de la web. Los valores de
        inscripción, mensualidades, la plataforma ALEKS y las donaciones se coordinan directamente
        con el equipo de la fundación.
      </p>
      <p>
        Las condiciones de devolución de la inscripción y las mensualidades las informa
        coordinación al momento de coordinar el pago. Para consultas o solicitudes escribe a{" "}
        {ORG.email} o al {ORG.phone}.
      </p>
      <p>
        Las donaciones son aportes voluntarios. Si hubo un error en el monto o en el envío,
        escríbenos para revisarlo.
      </p>
      <p>
        Un certificado descargable no es un bien físico ni un título oficial y no genera derecho a
        reembolso.
      </p>
    </LegalLayout>
  );
}

export function NoticesPage() {
  return (
    <LegalLayout title="Avisos, riesgos y cumplimiento">
      <h2>Datos institucionales publicados</h2>
      <ul>
        <li>Nombre: {ORG.name}.</li>
        <li>Domicilio: {ORG.legalAddress}. Personería jurídica por Acuerdo Ministerial N.º 203 del 15 de octubre de 2010 (MIES).</li>
        <li>Correo: {ORG.email}. Teléfono / WhatsApp: {ORG.phone}.</li>
      </ul>
      <h2>Alcance</h2>
      <ul>
        <li>El sitio informa sobre la fundación y permite enviar solicitudes de inscripción y donación, que se coordinan por WhatsApp.</li>
        <li>No se cobra dentro de la web y no se otorgan títulos oficiales.</li>
        <li>No hay analítica de terceros ni publicidad.</li>
      </ul>
      <h2>Normas de referencia</h2>
      <p>
        Ecuador: LOPDP, Código de la Niñez y Adolescencia, Ley de Comercio Electrónico. Si hay
        usuarios en la Unión Europea, también GDPR. Si hay menores en EE.UU., COPPA.
      </p>
      <p>Textos de este aviso actualizados el {ORG.lastUpdated}.</p>
    </LegalLayout>
  );
}

export function ContactPage() {
  return (
    <LegalLayout title="Contacto">
      <p>{ORG.name}</p>
      <p>{ORG.legalAddress}</p>
      <p>{ORG.ruc}</p>
      <p>{ORG.email}</p>
      {PLATFORM_ENABLED && (
        <p>
          También puedes usar <Link to="/app/asistencia">Asistencia FIF</Link> si ya tienes cuenta, o
          la <Link to="/profesores">zona de docentes</Link>.
        </p>
      )}
    </LegalLayout>
  );
}
