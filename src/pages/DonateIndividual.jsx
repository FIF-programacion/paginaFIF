import { useState } from "react";
import { Link } from "react-router-dom";
import { RequestFormModal } from "../components/RequestFormModal";
import { ORG } from "../data/org";
import "./Landing.css";

const AMOUNTS = [10, 20, 50];

export default function DonateIndividual() {
  const [frequency, setFrequency] = useState("once");
  const [amount, setAmount] = useState(10);
  const [custom, setCustom] = useState("");
  const [open, setOpen] = useState(false);
  const value = amount === "other" ? Number(custom) || "" : amount;
  const label = frequency === "monthly" ? "Donación mensual" : "Donación única";

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
              <button key={item} type="button" className={amount === item ? "is-on" : ""} onClick={() => { setAmount(item); setOpen(true); }}>
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

          <button className="donate-submit" type="button" onClick={() => setOpen(true)}>
            Continuar con ${value || "—"}
          </button>
          <p className="donate-note">
            No hay cobro en la web. Al elegir un monto se abre un formulario y el aporte se coordina por WhatsApp con {ORG.email}.
          </p>
        </section>
        <img src="/images/dona-aula.png" alt="Niñas estudiando en un taller de FIF" className="donate-photo" />
      </main>
      {open && (
        <RequestFormModal
          packageName={label}
          initial={{ amount: value }}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}
