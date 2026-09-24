import { useState } from "react";

const TESTIMONIALS = [
  {
    quote: "Gracias a FIF, mi hijo ahora disfruta aprender mientras juega y se siente seguro en cada actividad. Hemos crecido como familia.",
    name: "María G.",
    role: "madre beneficiaria",
  },
  {
    quote: "Ser parte de los talleres de la fundación me ha enseñado que cada pequeño gesto puede cambiar vidas.",
    name: "Ana C.",
    role: "docente colaboradora",
  },
  {
    quote: "Trabajar con FIF es inspirador: niños y familias se empoderan y los resultados se ven en cada sonrisa y aprendizaje.",
    name: "Claire Brooks",
    role: "MI",
  },
];

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const item = TESTIMONIALS[index];
  const go = (step) => {
    setIndex((current) => (current + step + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  return (
    <section className="lp-quotes" id="testimonios">
      <div className="lp-quotes-grid">
        <div className="lp-quotes-intro">
          <h2 className="lp-quotes-title">De nuestra comunidad.</h2>
          <p className="lp-quotes-lead">Esto es lo que familias y colaboradores cuentan sobre FIF.</p>
          <div className="lp-quotes-nav">
            <button type="button" aria-label="Testimonio anterior" onClick={() => go(-1)}>
              ←
            </button>
            <button type="button" aria-label="Testimonio siguiente" onClick={() => go(1)}>
              →
            </button>
          </div>
        </div>
        <blockquote className="lp-quotes-card" key={item.name}>
          <span className="lp-quotes-mark" aria-hidden="true">“</span>
          <p className="lp-quotes-text">{item.quote}”</p>
          <footer className="lp-quotes-who">
            <strong>{item.name}</strong>
            <span>{item.role}</span>
          </footer>
        </blockquote>
      </div>
    </section>
  );
}
