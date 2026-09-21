import { Link } from "react-router-dom";
import { ORG } from "../data/org";

export function SiteFooter() {
  return (
    <footer className="landing-footer legal-footer">
      <div>
        <h3>La fundación</h3>
        <p>{ORG.name}.</p>
        <p>{ORG.country}.</p>
        <p>{ORG.legalAddress}.</p>
        <p>{ORG.ruc}.</p>
        <Link to="/legal/contacto">Contacto.</Link>
      </div>
      <div>
        <h3>Plataforma</h3>
        <Link to="/">Sitio de la fundación.</Link>
        <Link to="/fif-learning">FIF Learning.</Link>
        <Link to="/profesores">Zona de docentes.</Link>
        <Link to="/app/asistencia">Asistencia.</Link>
      </div>
      <div>
        <h3>Legal</h3>
        <Link to="/legal/terminos">Términos y condiciones.</Link>
        <Link to="/legal/privacidad">Política de privacidad.</Link>
        <Link to="/legal/cookies">Política de cookies.</Link>
        <Link to="/legal/reembolsos">Política de reembolsos.</Link>
        <Link to="/legal/avisos">Avisos y riesgos.</Link>
      </div>
      <div>
        <h3>Actualización</h3>
        <p>Textos legales actualizados el {ORG.lastUpdated}.</p>
        <p>FIF Learning web.</p>
        <p>No hay app para Android publicada por ahora.</p>
      </div>
    </footer>
  );
}
