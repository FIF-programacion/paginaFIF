import { useState } from "react";
import { Link } from "react-router-dom";
import { ORG, assistanceWhatsAppUrl } from "../data/org";
import "./Landing.css";

const AMOUNTS = [10, 20, 50];

export default function DonateIndividual() {
  const [frequency, setFrequency] = useState("once");
  const [amount, setAmount] = useState(10);
  const [custom, setCustom] = useState("");
  const value = amount === "other" ? Number(custom) || 0 : amount;
  const label = frequency === "monthly" ? "mensual" : "única";
  const href = assistanceWhatsAppUrl(
    `Hola FIF, quiero hacer una donación individual ${label} de $${value}.`,
  );

  return (
    <div className="donate-page">
      <header className="donate-top">
        <Link to="/#dona" className="donate-back">← Volver</Link>
      </header>
      <main className="donate-layout">
        <section className="donate-copy">
          <h1>Donación individual</h1>
          <p>
            Cada aporte cuenta. Con tu apoyo, podemos continuar formando mentes brillantes,
            promoviendo la igualdad de oportunidades y fortaleciendo la pasión por las matemáticas
            en nuestra comunidad.
          </p>

          <p className="donate-label">Frecuencia</p>
          <div className="donate-options">
            <button type="button" className={frequency === "once" ? "is-on" : ""} onClick={() => setFrequency("once")}>
              Una vez
            </button>
            <button type="button" className={frequency === "monthly" ? "is-on" : ""} onClick={() => setFrequency("monthly")}>
              Mensual
            </button>
          </div>

          <p className="donate-label">Monto</p>
          <div className="donate-options donate-amounts">
            {AMOUNTS.map((item) => (
              <button key={item} type="button" className={amount === item ? "is-on" : ""} onClick={() => setAmount(item)}>
                ${item}
              </button>
            ))}
            <button type="button" className={amount === "other" ? "is-on" : ""} onClick={() => setAmount("other")}>
              Otro
            </button>
          </div>
          {amount === "other" && (
            <input
              className="donate-custom"
              type="number"
              min="1"
              placeholder="Monto"
              value={custom}
              onChange={(event) => setCustom(event.target.value)}
            />
          )}

          <a className="donate-submit" href={href} target="_blank" rel="noreferrer">
            Donar ${value || "—"}
          </a>
          <p className="donate-note">
            El aporte se coordina por WhatsApp con {ORG.email}. Aún no hay cobro en línea.
          </p>
        </section>
        <img src="/images/dona-aula.png" alt="Niñas estudiando en un taller de FIF" className="donate-photo" />
      </main>
    </div>
  );
}
