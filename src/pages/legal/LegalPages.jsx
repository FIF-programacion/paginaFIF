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
      <p>Solo pedimos lo necesario para operar esta versión educativa:</p>
      <ul>
        <li>Nombre y apellidos, para mostrar tu perfil y el certificado.</li>
        <li>Correo, para entrar a la cuenta en este dispositivo.</li>
        <li>Contraseña, que se guarda como resumen criptográfico y no en texto claro.</li>
        <li>Grupo de edad (menos de 12 años o 12 años o más) y meta diaria, para elegir la dificultad.</li>
        <li>Si la cuenta es de una persona menor de 12 años: nombre y correo de madre, padre o tutor, y su autorización.</li>
        <li>Progreso de lecciones, puntos, racha, pruebas y mensajes de asistencia, en tu navegador.</li>
      </ul>
      <p>No pedimos cédula, ubicación, fotos ni datos de pago.</p>
      <h2>3. Para qué los usamos</h2>
      <p>
        Crear la cuenta, adaptar cursos, guardar progreso, emitir el certificado de finalización,
        permitir pruebas de docentes y responder solicitudes de asistencia guardadas en el
        dispositivo.
      </p>
      <h2>4. Base legal (Ecuador)</h2>
      <p>
        Tratamos datos según la Ley Orgánica de Protección de Datos Personales (LOPDP) y, cuando
        aplica, el Código de la Niñez y Adolescencia. La base es tu consentimiento (y el de la
        persona tutora si hay menores de 12 años) y la ejecución del servicio educativo solicitado.
      </p>
      <h2>5. Dónde se guardan</h2>
      <p>
        Esta versión funciona en el navegador (almacenamiento local). No hay servidor de la
        fundación ni copias en la nube. Quien use el mismo computador puede ver esos datos. No es
        un sistema de expediente oficial.
      </p>
      <h2>6. Menores de 12 años</h2>
      <p>
        El registro de menores de 12 años exige autorización de madre, padre o tutor. Sin esa
        casilla marcada no se crea la cuenta.
      </p>
      <h2>7. Conservación y tus derechos</h2>
      <p>
        Los datos permanecen hasta que borres el almacenamiento del sitio o cierres la cuenta en
        este dispositivo. Puedes pedir acceso, rectificación o supresión escribiendo por Asistencia
        FIF o borrando los datos del navegador. La fundación debe habilitar un canal institucional
        antes de un lanzamiento público con datos reales.
      </p>
      <h2>8. Destinatarios y transferencias</h2>
      <p>
        No vendemos datos. No hay analítica de terceros ni redes publicitarias. Las tipografías se
        sirven desde este mismo sitio.
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
        Al crear una cuenta o usar FIF Learning aceptas estos términos, la{" "}
        <Link to="/legal/privacidad">privacidad</Link> y la{" "}
        <Link to="/legal/cookies">política de cookies</Link>.
      </p>
      <h2>2. Qué es este servicio</h2>
      <p>
        FIF Learning es una plataforma de refuerzo académico y práctica gamificada de {ORG.name}.
        No es escuela presencial, no otorga títulos oficiales y no sustituye el currículo
        ministerial.
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
        <li>Cuenta (nombre, correo, resumen de contraseña, grupo de edad).</li>
        <li>Progreso, puntos, racha, pruebas y calificaciones locales.</li>
        <li>El aviso “Entendido” de esta política.</li>
      </ul>
      <p>
        Eso equivale a una cookie técnica: sin ello no puedes entrar ni continuar una lección. La
        LOPDP y las normas de cookies exigen informar; no exigir un “acepto todo” si no hay
        rastreo.
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
        FIF Learning, en esta versión, no cobra matrícula, suscripción ni compras dentro de la
        web. No hay pagos ni pasarela. Por eso no hay reembolsos: no se recauda dinero.
      </p>
      <p>
        Si en el futuro la fundación ofrece un curso de pago, esta política debe actualizarse
        antes de cobrar, con precio, plazo de desistimiento (cuando aplique la normativa de
        comercio electrónico) y canal de devolución.
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
        <li>El número de RUC aún no ha sido entregado por la fundación para publicación. Cuando exista, se actualizará este aviso, el pie de página y el contacto.</li>
      </ul>
      <h2>Antes de un lanzamiento público hay que completar</h2>
      <ul>
        <li>Publicar el RUC cuando la fundación lo confirme.</li>
        <li>Migrar los datos desde AWS a una base propia e interrumpir el uso de solo almacenamiento local del navegador.</li>
        <li>Servidor, autenticación real y copias de seguridad.</li>
        <li>Registro o análisis de impacto si el volumen de datos de menores lo exige.</li>
        <li>Contrato con docentes y autorización de imagen si se publican fotos reales.</li>
      </ul>
      <h2>Riesgos que ya se mitigaron en el código</h2>
      <ul>
        <li>Se quitó un personaje con copyright de un estudio ajeno.</li>
        <li>No hay reseñas inventadas ni app de Android anunciada como existente.</li>
        <li>No se prometen títulos oficiales ni “transformación de vida” como resultado garantizado.</li>
        <li>No hay analítica de terceros ni fuentes descargadas desde Google en tiempo de uso.</li>
        <li>La ayuda ya no aparenta enviar correos a un servidor.</li>
        <li>Las claves de demostración no se muestran en las pantallas de inicio de sesión.</li>
        <li>El alta pública de estudiantes y docentes está cerrada: las cuentas las crea coordinación.</li>
      </ul>
      <h2>Riesgos que siguen abiertos</h2>
      <ul>
        <li>El almacenamiento local no es un expediente seguro ni multi-dispositivo.</li>
        <li>El hash de contraseña en el cliente no reemplaza autenticación de servidor.</li>
        <li>Varias personas en el mismo navegador pueden ver el progreso guardado.</li>
        <li>Las ilustraciones y fotos deben ser originales, licenciadas o contar con cesión de imagen.</li>
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
