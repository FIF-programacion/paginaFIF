import { Link } from "react-router-dom";
import { BrandLockup } from "./Brand";
import { SiteFooter } from "./SiteFooter";
import { ORG } from "../data/org";

export function LegalLayout({ title, children }) {
  return (
    <div className="page legal-page">
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <header className="landing-header">
        <BrandLockup to="/" />
        <Link to="/" className="btn btn-blue login-chip">
          Volver al inicio
        </Link>
      </header>
      <main id="contenido" className="legal-body">
        <p className="legal-kicker">{ORG.name}</p>
        <h1>{title}</h1>
        <p className="legal-meta">Última actualización: {ORG.lastUpdated}. País: {ORG.country}.</p>
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
