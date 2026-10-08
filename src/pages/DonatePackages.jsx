import { useState } from "react";
import { Link } from "react-router-dom";
import { RequestFormModal } from "../components/RequestFormModal";
import { ORG } from "../data/org";
import "./Landing.css";

const PACKAGES = [
  { name: "Taller", amount: 100, text: "Materiales y una jornada de aprendizaje para un grupo pequeño." },
  { name: "Aula", amount: 250, text: "Apoya un ciclo de talleres de matemáticas, arte o música." },
  { name: "Programa", amount: 500, text: "Impulsa un mes de actividades para niños y familias." },
  { name: "Comunidad", amount: 1000, text: "Sostiene un bloque de proyectos abiertos a la comunidad." },
];

export default function DonatePackages() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="donate-page">
      <header className="donate-top">
        <Link to="/#dona" className="donate-back">← Volver</Link>
      </header>
      <main className="donate-layout donate-layout--packages">
        <section className="donate-copy">
          <h1>Paquetes de donación</h1>
          <p>
            Pensado para organizaciones, empresas y aliados que quieren acompañar a FIF con un
            aporte definido. Elige un paquete: se abre un formulario. El donativo no se cobra en la web.
          </p>
          <div className="donate-packages">
            {PACKAGES.map((item) => (
              <button
                key={item.name}
                type="button"
                className="donate-package"
                onClick={() => setSelected(item)}
              >
                <h2>{item.name}</h2>
                <p className="donate-price">${item.amount}</p>
                <p>{item.text}</p>
                <span>Elegir paquete</span>
              </button>
            ))}
          </div>
          <p className="donate-note">Coordinación: {ORG.email} · {ORG.phone}</p>
        </section>
        <img src="/images/dona-aula.png" alt="Taller de la fundación" className="donate-photo" />
      </main>
      {selected && (
        <RequestFormModal
          packageName={`Paquete ${selected.name}`}
          initial={{ amount: selected.amount }}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
