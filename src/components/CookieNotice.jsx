import { Link } from "react-router-dom";
import { useGame } from "../context/GameContext";

export function CookieNotice() {
  const { noticeSeen, acknowledgeNotice, hydrated } = useGame();
  if (!hydrated || noticeSeen) return null;

  return (
    <div className="cookie-banner" role="dialog" aria-labelledby="cookie-title" aria-describedby="cookie-text">
      <div>
        <h2 id="cookie-title">Almacenamiento necesario</h2>
        <p id="cookie-text">
          FIF Learning usa almacenamiento local estrictamente necesario para tu cuenta, progreso y
          el aviso de esta franja. No usamos cookies de publicidad ni de analítica. Puedes leer la{" "}
          <Link to="/legal/cookies">política de cookies</Link> y la{" "}
          <Link to="/legal/privacidad">política de privacidad</Link>.
        </p>
      </div>
      <button className="btn btn-blue" type="button" onClick={acknowledgeNotice}>
        Entendido
      </button>
    </div>
  );
}
