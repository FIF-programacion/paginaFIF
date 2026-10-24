import { useState } from "react";
import { Link } from "react-router-dom";

const NOTICE_KEY = "fif-learning-notice-v1";

function readSeen() {
  try {
    return localStorage.getItem(NOTICE_KEY) === "1";
  } catch {
    return false;
  }
}

export function CookieNotice() {
  const [seen, setSeen] = useState(readSeen);
  if (seen) return null;

  const acknowledge = () => {
    try {
      localStorage.setItem(NOTICE_KEY, "1");
    } catch {
      // Sin almacenamiento (modo privado): el aviso se oculta solo en esta visita.
    }
    setSeen(true);
  };

  return (
    <div className="cookie-banner" role="dialog" aria-labelledby="cookie-title" aria-describedby="cookie-text">
      <div>
        <h2 id="cookie-title">Almacenamiento necesario</h2>
        <p id="cookie-text">
          Este sitio usa almacenamiento local estrictamente necesario, por ejemplo para recordar que
          viste esta franja. No usamos cookies de publicidad ni de analítica. Puedes leer la{" "}
          <Link to="/legal/cookies">política de cookies</Link> y la{" "}
          <Link to="/legal/privacidad">política de privacidad</Link>.
        </p>
      </div>
      <button className="btn btn-blue" type="button" onClick={acknowledge}>
        Entendido
      </button>
    </div>
  );
}
