import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { BrandLockup, RainbowTitle, Wordmark } from "../components/Brand";
import { SiteFooter } from "../components/SiteFooter";
import { LANDING_COURSES } from "../data/courses";
import { useGame } from "../context/GameContext";
import { homePath } from "../utils/roles";

function ScrollFillBar({ sectionRef }) {
  const [fill, setFill] = useState(0);

  useEffect(() => {
    const update = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      const scrolled = viewport - rect.top;
      const total = viewport + rect.height;
      const next = Math.min(100, Math.max(0, (scrolled / total) * 100));
      setFill(next);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [sectionRef]);

  return (
    <div
      className="girl-progress"
      role="progressbar"
      aria-label="Progreso al recorrer la sección"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(fill)}
    >
      <div className="girl-progress-fill" style={{ width: `${fill}%` }} />
    </div>
  );
}

export default function FifLearning() {
  const { user } = useGame();
  const startTo = user ? homePath(user) : "/login";
  const createTo = user ? startTo : "/registro";
  const progressNoteRef = useRef(null);

  return (
    <div className="page">
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <header className="landing-header">
        <BrandLockup to="/fif-learning" />
        <div className="header-actions">
          <Link to="/" className="text-link">La fundación</Link>
          <Link to="/profesores" className="text-link">Docentes y coordinación</Link>
          <Link to={startTo} className="btn btn-blue login-chip">Iniciar sesión</Link>
        </div>
      </header>

      <main id="contenido">
        <section className="landing-hero">
          <div>
            <RainbowTitle
              className="hero-title"
              parts={[
                { text: "APRENDAMOS DE LA", color: "#1d4ed8" },
                { text: "MEJOR Y MAS", color: "#1d4ed8" },
                { text: "DIVERTIDA", color: "#1d4ed8" },
                { text: "MANERA !", color: "#1d4ed8" },
              ]}
            />
            <div className="hero-actions">
              <Link to={startTo} className="btn btn-green btn-wide">Empezar ahora</Link>
              <Link to={createTo} className="btn btn-green btn-wide">Crear cuenta de estudiante</Link>
            </div>
          </div>
        </section>

        <section className="landing-section foundation-intro" id="fundacion">
          <div>
            <h2 className="landing-kicker" style={{ color: "#1d4ed8" }}>Fundación Integral de Familias</h2>
            <p className="section-copy">
              Educamos con sentido, fortalecemos familias y sembramos futuro. En FIF trabajamos por
              una infancia feliz y una comunidad que transforma.
            </p>
            <p className="section-copy">
              Acompañamos a niños, niñas y familias con educación integral, esperanza y compromiso real.
            </p>
          </div>
          <img src="/images/LOGO_COLOR.png" alt="Logo de la Fundación Integral de Familias" className="character" />
        </section>

        <section className="landing-section" id="sobre">
          <div>
            <Wordmark className="landing-kicker" />
            <p className="section-copy">
              FIF Learning es el espacio digital de refuerzo académico de la Fundación Integral de
              Familias. Ofrece lecciones cortas, ejercicios interactivos y un registro de progreso
              (puntos, racha e insignias) pensado para practicar en casa, no para reemplazar la
              escuela.
            </p>
          </div>
          <img src="/images/family-sun.jpg" alt="Ilustración de una familia junta, símbolo de acompañamiento" className="character" />
        </section>

        <section className="landing-section reverse" id="metodo">
          <img src="/images/kid-pointing.jpg" alt="Ilustración de un niño señalando hacia los pasos del método" className="character" />
          <div>
            <h2 className="landing-kicker" style={{ color: "#1d4ed8" }}>¿Cómo funciona?</h2>
            <p className="section-copy">Tres pasos simples dentro de la plataforma:</p>
            <p className="section-copy">1. Lecciones cortas: practica unos minutos al día con ejercicios interactivos.</p>
            <p className="section-copy">2. Mapa de progreso: completa nodos, suma puntos y desbloquea el siguiente módulo.</p>
            <p className="section-copy">3. Certificado de finalización: al terminar un curso puedes descargar un PDF de reconocimiento de FIF Learning.</p>
          </div>
        </section>

        <section className="progress-note" ref={progressNoteRef}>
          <div>
            <h2 className="landing-kicker" style={{ color: "#1d4ed8", fontSize: 36 }}>
              Cursos según la edad
            </h2>
            <p className="section-copy">
              Al registrarte eliges si tienes menos de 12 años o 12 años o más. Esa elección cambia
              la dificultad y los ejercicios. El registro de menores de 12 años pide autorización
              de madre, padre o tutor.
            </p>
          </div>
          <div className="progress-visual">
            <ScrollFillBar sectionRef={progressNoteRef} />
            <img
              src="/images/girl-hands-up.jpg"
              alt="Ilustración de una niña mirando hacia arriba con las manos en la cabeza"
              className="character girl-progress-art"
            />
          </div>
        </section>

        <section className="courses-wrap" id="cursos">
          <h2 className="landing-kicker" style={{ color: "#1d4ed8", textAlign: "center" }}>Nuestros cursos</h2>
          <div className="courses-grid">
            <p className="section-copy">
              Las materias fueron preparadas por el equipo pedagógico de la fundación como refuerzo
              digital. La disponibilidad depende del grupo de edad de la cuenta. Completar un curso
              no equivale a un título oficial.
            </p>
            <div className="course-list">
              {(user?.ageGroup ? LANDING_COURSES.filter((course) => course.ages.includes(user.ageGroup)) : LANDING_COURSES).map((course) => (
                <Link
                  key={course.id}
                  to={user ? `/app/curso/${course.id}` : "/registro"}
                  className="course-chip"
                  style={{ background: course.color, color: "#111827" }}
                >
                  {course.title}
                  <span className="chip-age">
                    {course.ages.includes("under12") && course.ages.includes("over12")
                      ? "Todas las edades"
                      : course.ages.includes("under12")
                        ? "Menos de 12"
                        : "12 años o más"}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="cta-band">
          <RainbowTitle
            as="h2"
            parts={[
              { text: "EMPECEMOS A", color: "#1d4ed8" },
              { text: "APRENDER AHORA", color: "#1d4ed8" },
            ]}
          />
          <Link to={createTo} className="btn btn-green btn-wide">Crear cuenta</Link>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
