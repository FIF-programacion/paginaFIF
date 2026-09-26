import { Link } from "react-router-dom";
import { ORG } from "../data/org";

export function SiteFooter() {
  return (
    <footer className="fif-footer">
      <div className="fif-footer-content">

        <div className="fif-footer-brand">
          <h2>FIF</h2>
          <p>
            Educación, familia y oportunidades
            <br />
            para crecer juntos.
          </p>
          <span>Quito, Ecuador</span>
        </div>

        <div className="fif-footer-column">
          <h3>Fundación</h3>
          <Link to="/">Nosotros</Link>
          <Link to="/legal/contacto">Contacto</Link>
          <Link to="/dona/individual">Donar</Link>
        </div>

        <div className="fif-footer-column">
          <h3>Plataforma</h3>
          <Link to="/fif-learning">FIF Learning</Link>
          <Link to="/profesores">Docentes</Link>
          <Link to="/login">Iniciar sesión</Link>
          <Link to="/app/asistencia">Asistencia</Link>
        </div>

        <div className="fif-footer-column">
          <h3>Legal</h3>
          <Link to="/legal/terminos">Términos</Link>
          <Link to="/legal/privacidad">Privacidad</Link>
          <Link to="/legal/cookies">Cookies</Link>
          <Link to="/legal/reembolsos">Reembolsos</Link>
          <Link to="/legal/avisos">Avisos</Link>
        </div>

      </div>

      <div className="fif-footer-bottom">
        <p>© 2026 {ORG.name}</p>
        <p>Fundación Integral de Familias · Ecuador</p>
      </div>
    </footer>
  );
}